import { DeleteOutlined, EditOutlined, LogoutOutlined, PlusOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, DatePicker, Drawer, Empty, Form, Input, Layout, List, message, Popconfirm, Row, Select, Skeleton, Space, Typography, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { FormInstance, useForm } from 'antd/lib/form/Form'
import { FormListFieldData } from 'antd/lib/form/FormList'
import JSCookie from 'js-cookie'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Navigation from '../../components/Navigation'
import { useCreate } from '../../hooks/pet/useCreate'
import { useFind } from '../../hooks/pet/useFind'
import { useFind as useFindFeeds } from '../../hooks/feed/useFind'
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
  const [data, setData] = useState<any[]>()
  const [offset, setOffset] = useState<number>(0)
  const [find, feeds, error, reset] = useFindFeeds()

  const size = 8

  useEffect(() => {
    getPets({ owner: user?.email })
  }, [user])

  useEffect(() => {
    form.setFieldsValue({
      pets: pets.map(pet => ({ ...pet, birth_date: pet.birth_date ? moment(pet.birth_date, 'YYYY-MM-DD') : null }))
    })
  }, [pets])

  useEffect(() => {
    if (user) {
      find({ rangeFrom: offset, rangeTo: offset + size, owner: user.email })
    }
  }, [user])

  useEffect(() => {
    setData([...data || [], ...feeds.filter(feed => !data?.find(d => d.id === feed.id))])
  }, [feeds])

  useEffect(() => reset(), [offset])

  useEffect(() => {
    if (error === undefined) {
      find({ rangeFrom: offset, rangeTo: offset + size })
    }
  }, [error])

  const logout = () => {
    JSCookie.remove('authorization')
    JSCookie.remove('refresh_token')
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
            {!fields?.length ? <Empty style={{ marginBottom: '20px' }} /> : ''}
            {fields.map((field, index) => <PetForm key={index} field={field} remove={remove} form={form} index={index} />)}
            <Form.Item wrapperCol={{ span: 24 }} style={{ marginTop: '5px' }}>
              <Button size="large" shape="round" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Pet
              </Button>
            </Form.Item>
          </>}
        </Form.List>
      </Form>

      <List dataSource={data}
        loading={error === undefined}
        loadMore={<div style={{ textAlign: 'center', margin: '15px 10px 40px' }}>
          <Button shape="round"
            disabled={!feeds?.length || feeds?.length <= size}
            onClick={() => setOffset(data?.length || 0)}>
            {!feeds?.length || feeds?.length <= size ? 'End of Page' : 'Load More'}
          </Button>
        </div>}
        renderItem={feed => <Link to={`/feed/${feed.id}`}>
          <img style={{ cursor: 'pointer', width: '31%', margin: '1.17%' }} alt={feed.url} src={feed.url} />
        </Link>} />
    </Col>
    <Navigation page="profile" />
  </Row>
}

const PetForm: React.FC<PetFormProps> = ({ field, remove: removeField, form, index }) => {
  const [showDrawer, setShowDrawer] = useState<boolean>(!form.getFieldValue('pets')?.[index]?.name)
  const [save, pet, errorCreate, resetCreate] = useCreate()
  const [remove, errorRemove, resetRemove] = useRemove()
  const [update, errorUpdate, resetUpdate] = useUpdate()
  const [img, setImg] = useState<any>()

  useEffect(() => {
    if (form.getFieldValue('pets')?.[index]?.avatar_url) {
      setImg({
        uid: '1',
        name: form.getFieldValue('pets')?.[index]?.avatar_url.split(/(\\|\/)/g).pop() || 'blank',
        status: 'done',
        url: form.getFieldValue('pets')?.[index]?.avatar_url
      })
    }
  }, [form])

  useEffect(() => {
    if (pet) {
      form.setFieldsValue({
        pets: form.getFieldValue('pets')?.map((data: any, i: number) => i === index ? {
          ...pet,
          birth_date:
            pet.birth_date ? moment(pet.birth_date, 'YYYY-MM-DD') : null
        } : data)
      })
    }
  }, [pet])

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
      removeField(index)
      resetRemove()
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

  useEffect(() => {
    form.setFieldsValue({
      pets: form.getFieldValue('pets')?.map((pet: any, i: number) => {
        if (i === index) {
          return { ...pet, avatar_url: img?.url }
        }
        return pet
      })
    })
  }, [img])

  const saveItem = () => {
    if (form.getFieldValue('pets')?.[index]?.name && form.getFieldValue('pets')?.[index]?.avatar_url && form.getFieldValue('pets')?.[index]?.type) {
      if (form.getFieldValue('pets')?.[index]?.id) {
        update(form.getFieldValue('pets')?.[index]?.id, form.getFieldValue('pets')?.[index])
      } else {
        save(form.getFieldValue('pets')?.[index])
      }
    } else {
      message.error('Please fill all required fields')
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

  return <Layout.Content style={{ padding: '5px 0' }}>
    <Card hoverable onClick={() => setShowDrawer(true)}>
      <Row gutter={16}>
        <Col span={8} md={5} sm={6}>
          <Typography.Paragraph style={{ textAlign: 'center', marginBottom: 0 }}>
            {form.getFieldValue('pets')?.[index]?.avatar_url ? <Avatar src={form.getFieldValue('pets')?.[index]?.avatar_url} style={{ width: 64, height: 64 }} /> : <Skeleton.Image style={{ width: 64, height: 64 }} />}
          </Typography.Paragraph>
        </Col>
        <Col span={16} md={19} sm={18}>
          <Typography.Title level={4} style={{ marginBottom: 0, marginTop: form.getFieldValue('pets')?.[index]?.breed ? '3px' : '13px' }}>
            {form.getFieldValue('pets')?.[index]?.name || 'Unknown'}
          </Typography.Title>
          <Typography.Paragraph>
            <Typography.Text type="secondary">
              {form.getFieldValue('pets')?.[index]?.breed}
            </Typography.Text>
          </Typography.Paragraph>
        </Col>
      </Row>
    </Card>
    <Drawer title={form.getFieldValue('pets')?.[index]?.id ? `Update ${form.getFieldValue('pets')?.[index]?.name}` : 'Add Pet'} closable placement="right" visible={showDrawer} onClose={() => setShowDrawer(false)}>
      <div key={`drawer-${index}`}>
        <Form.Item rules={[{ required: true, message: 'Please upload the avatar' }]}>
          <ImgCrop>
            <Upload
              maxCount={1}
              withCredentials
              listType="picture-card"
              action={`${process.env.REACT_APP_API_URL}/api/upload`}
              name="upload"
              fileList={img ? [img] : []}
              onRemove={() => setImg(undefined)}
              onChange={({ fileList }) => setImg({
                ...fileList?.[0] || {},
                url: fileList?.[0].response?.file.Location || undefined
              })}>
              <UploadOutlined /> &nbsp; Upload
            </Upload>
          </ImgCrop>
        </Form.Item>
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
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item hidden {...field} name={[field.name, 'id']} fieldKey={[field.fieldKey, 'id']}>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item hidden {...field} name={[field.name, 'avatar_url']} fieldKey={[field.fieldKey, 'avatar_url']}>
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