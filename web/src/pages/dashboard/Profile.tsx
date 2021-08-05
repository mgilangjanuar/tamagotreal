import { DeleteOutlined, EditOutlined, LogoutOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Col, DatePicker, Drawer, Form, Input, Layout, message, Popconfirm, Row, Select, Space, Typography } from 'antd'
import { FormInstance, useForm } from 'antd/lib/form/Form'
import { FormListFieldData } from 'antd/lib/form/FormList'
import JSCookie from 'js-cookie'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useCreate } from '../../hooks/pet/useCreate'
import { useFind } from '../../hooks/pet/useFind'
import { useRemove } from '../../hooks/pet/useRemove'
import { useUpdate } from '../../hooks/pet/useUpdate'

interface Props {
  user: any
}

interface PetFormProps {
  field: FormListFieldData,
  remove: (index: number | number[]) => void,
  form: FormInstance,
  index: number
}

const Profile: React.FC<Props> = ({ user }) => {
  const history = useHistory()
  const [form] = useForm()
  const [getPets, pets] = useFind()

  useEffect(() => {
    getPets({ owner: user?.email })
  }, [user])

  useEffect(() => {
    form.setFieldsValue({
      pets: pets.map(pet => ({ ...pet, birth_date: pet.birth_date ? moment(pet.birth_date, 'YYYY-MM-DD') : null }))
    })
  }, [pets])

  const logout = () => {
    JSCookie.remove('authorization')
    history.replace('/')
  }
  return <Row style={{ minHeight: '85vh', padding: '20px 0' }}>
    <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
      <Typography.Title level={2}>
        My Pets
        <Button style={{ float: 'right' }} danger type="text" onClick={logout} icon={<LogoutOutlined />} />
      </Typography.Title>
      <Form form={form} layout="vertical">
        <Form.List name="pets">
          {(fields, { add, remove }) => <>
            {fields.map((field, index) => <PetForm key={index} field={field} remove={remove} form={form} index={index} />)}
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add pet
              </Button>
            </Form.Item>
          </>}
        </Form.List>
      </Form>
    </Col>
  </Row>
}

const PetForm: React.FC<PetFormProps> = ({ field, remove: removeField, form, index }) => {
  const [showDrawer, setShowDrawer] = useState<boolean>(!form.getFieldValue('pets')?.[index]?.name)
  const [save, errorCreate, resetCreate] = useCreate()
  const [remove, errorRemove, resetRemove] = useRemove()
  const [update, errorUpdate, resetUpdate] = useUpdate()

  useEffect(() => {
    if (errorCreate) {
      message.error(errorCreate.data?.errorCreate || errorCreate.message || 'Something error')
    } else if (errorCreate === null) {
      message.success('Saved')
      resetCreate()
      setShowDrawer(false)
    }
  }, [errorCreate])

  useEffect(() => {
    if (errorRemove) {
      message.error(errorRemove.data?.errorRemove || errorRemove.message || 'Something error')
    } else if (errorRemove === null) {
      message.success('Removed')
      resetRemove()
      removeField(index)
      setShowDrawer(false)
    }
  }, [errorRemove])

  useEffect(() => {
    if (errorUpdate) {
      message.error(errorUpdate.data?.errorUpdate || errorUpdate.message || 'Something error')
    } else if (errorUpdate === null) {
      message.success('Updated')
      resetUpdate()
      setShowDrawer(false)
    }
  }, [errorUpdate])

  const saveItem = () => {
    if (form.getFieldValue('pets')?.[index]?.id) {
      update(form.getFieldValue('pets')?.[index]?.id, form.getFieldValue('pets')?.[index])
    } else {
      save(form.getFieldValue('pets')?.[index])
    }
  }

  const removeItem = () => {
    if (form.getFieldValue('pets')?.[index]?.id) {
      remove(form.getFieldValue('pets')?.[index].id)
    } else {
      removeField(index)
      setShowDrawer(false)
    }
  }

  return <Layout.Content style={{ padding: '8px 0' }}>
    <Card style={{ cursor: 'pointer' }} onClick={() => setShowDrawer(true)}>
      <Typography.Title level={4}>
        {form.getFieldValue('pets')?.[index]?.type === 'cat' ? '🐱' : ''}
        {form.getFieldValue('pets')?.[index]?.type === 'dog' ? '🐶' : ''}
        {form.getFieldValue('pets')?.[index]?.type === 'hamster' ? '🐹' : ''}
        &nbsp; {form.getFieldValue('pets')?.[index]?.name || 'Unknown'}
      </Typography.Title>
      <Typography.Paragraph>
        <Typography.Text type="secondary">
          {form.getFieldValue('pets')?.[index]?.breed}
          {form.getFieldValue('pets')?.[index]?.breed && form.getFieldValue('pets')?.[index]?.birth_date ? ' · ' : ''}
          {form.getFieldValue('pets')?.[index]?.birth_date?.format('YYYY-MM-DD') || ''}
        </Typography.Text>
      </Typography.Paragraph>
    </Card>
    <Drawer title={form.getFieldValue('pets')?.[index]?.id ? `Update ${form.getFieldValue('pets')?.[index]?.name}` : 'Add Pet'} closable placement="right" visible={showDrawer} onClose={() => setShowDrawer(false)}>
      <div key={`drawer-${index}`}>
        <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} {...field} label="Name" name={[field.name, 'name']} fieldKey={[field.fieldKey, 'name']} rules={[{ required: true, message: 'Please input the name' }]}>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} {...field} label="Type" name={[field.name, 'type']} fieldKey={[field.fieldKey, 'type']} rules={[{ required: true, message: 'Please input the type' }]}>
          <Select>
            <Select.Option value="cat">🐱 Cat</Select.Option>
            <Select.Option value="dog">🐶 Dog</Select.Option>
            <Select.Option value="hamster">🐹 Hamster</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} {...field} label="Breed" name={[field.name, 'breed']} fieldKey={[field.fieldKey, 'breed']}>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} {...field} label="Birth Date" name={[field.name, 'birth_date']} fieldKey={[field.fieldKey, 'birth_date']}>
          <DatePicker />
        </Form.Item>
        <Form.Item hidden {...field} name={[field.name, 'id']} fieldKey={[field.fieldKey, 'id']}>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item style={{ marginTop: '20px' }}>
          <Space style={{ float: 'right' }}>
            <Popconfirm title="Are you sure to delete this?" onConfirm={removeItem}>
              <Button type="link" danger icon={<DeleteOutlined />}>Remove</Button>
            </Popconfirm>
            <Button type="primary" icon={form.getFieldValue('pets')?.[index]?.id ? <EditOutlined /> : <SaveOutlined />} onClick={saveItem}>{form.getFieldValue('pets')?.[index]?.id ? 'Update' : 'Save'}</Button>
          </Space>
        </Form.Item>
      </div>
    </Drawer>
  </Layout.Content>
}

export default Profile