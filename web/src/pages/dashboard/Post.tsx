import { SendOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, message, Row, Select, Typography, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import Avatar from 'antd/lib/avatar/avatar'
import { useForm } from 'antd/lib/form/Form'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Navigation from '../../components/Navigation'
import { useCreate } from '../../hooks/feed/useCreate'
import { useFind } from '../../hooks/pet/useFind'

interface Props {
  user: any
}

const Post: React.FC<Props> = ({ user }) => {
  const [form] = useForm()
  const [img, setImg] = useState<any>()
  const [findPets, pets] = useFind()
  const [create, error, reset] = useCreate()
  const history = useHistory()

  useEffect(() => {
    findPets({ owner: user?.email })
  }, [user])

  useEffect(() => {
    form.setFieldsValue({ url: img?.file.Location })
  }, [img])

  useEffect(() => {
    if (error) {
      message.error(error.data?.error || error.message || 'Something error')
    } else if (error === null) {
      message.success('Post!')
      reset()
      form.resetFields()
      history.push('/dashboard/main')
    }
  }, [error])

  const save = () => {
    if (!img.file) {
      return message.error('Please upload the image')
    }

    const data = form.getFieldsValue()
    create(data)
  }

  return <Row style={{ minHeight: '85vh', padding: '20px 0' }}>
    <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
      <Typography.Title level={2}>New Post</Typography.Title>
      <Form form={form} layout="vertical" onFinish={save}>
        <Form.Item>
          <ImgCrop>
            <Upload
              maxCount={1}
              withCredentials
              listType="picture-card"
              action={`${process.env.REACT_APP_API_URL}/api/upload`}
              name="upload"
              onChange={({ file }) => setImg(file?.xhr ? JSON.parse(file?.xhr.response) : undefined)}>
              <UploadOutlined /> &nbsp; Upload
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} label="Pet" name="pet_id" rules={[{ required: true, message: 'Please select the pet' }]}>
          <Select size="large">
            {pets?.map(pet => <Select.Option value={pet.id}><Avatar src={pet.avatar_url} style={{ marginRight: '10px' }} /> {pet.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} label="Caption" name="caption">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="id" hidden>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="url" hidden>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Button size="large" shape="round" type="primary" htmlType="submit">Post <SendOutlined /></Button>
        </Form.Item>
      </Form>
    </Col>
    <Navigation page="post" />
  </Row>
}
export default Post