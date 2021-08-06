import { CommentOutlined, DeleteOutlined, EditOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons'
import { Button, Card, Col, Drawer, Form, Input, Layout, message, Popconfirm, Row, Select, Space, Tooltip, Typography } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import { useForm } from 'antd/lib/form/Form'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Navigation from '../../components/Navigation'
import { useDelete } from '../../hooks/feed/useDelete'
import { useLike } from '../../hooks/feed/useLike'
import { useRetrieve } from '../../hooks/feed/useRetrieve'
import { useUpdate } from '../../hooks/feed/useUpdate'
import { useFind } from '../../hooks/pet/useFind'
import { useMe } from '../../hooks/useMe'

interface PageProps extends RouteComponentProps<{
  id: string
}> {}

const Feed: React.FC<PageProps> = ({ match }) => {
  const history = useHistory()
  const [user] = useMe()
  const [retrieve, feed, error, reset] = useRetrieve()
  const [update, errorUpdate, resetUpdate] = useUpdate()
  const [like, feedLike] = useLike()
  const [remove, errorRemove] = useDelete()
  const [showDrawer, setShowDrawer] = useState<boolean>()
  const [form] = useForm()
  const [findPets, pets] = useFind()

  useEffect(() => {
    if (user === null) {
      return history.replace('/')
    }
    findPets({ owner: user?.email })
  }, [history, user])

  useEffect(() => {
    if (feedLike) {
      reset()
    }
  }, [feedLike])

  useEffect(() => {
    form.setFieldsValue(feed)
  }, [feed])

  useEffect(() => {
    if (error === undefined) {
      retrieve(match.params.id)
    }
  }, [error])

  useEffect(() => {
    if (errorRemove === null) {
      history.replace('/dashboard/main')
    }
  }, [errorRemove])

  useEffect(() => {
    if (errorUpdate === null) {
      message.success('Updated')
      setShowDrawer(false)
      reset()
    }
    resetUpdate()
  }, [errorUpdate])

  const finish = () => {
    update(feed.id, form.getFieldsValue())
  }

  return <>
    <Navbar />
    <Layout style={{ flexDirection: 'row' }}>
      <Layout.Content style={{ padding: '10px 10px 24px', margin: 0, minHeight: 280 }}>
        <Row style={{ minHeight: '85vh', padding: '0 0 70px' }}>
          <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
            <Card hoverable cover={<img src={feed?.url} alt={feed?.url} />} actions={[
              <Button key="like" onClick={() => like(feed?.id)} type="text" danger icon={feed?.likes?.includes(user.email) ? <HeartFilled /> : <HeartOutlined />}> &nbsp;{feed?.likes?.length || 0}</Button>,
              <Button key="comment" type="text" icon={<CommentOutlined />}></Button>
            ]} extra={feed.owner === user?.email ? <Space>
              <Tooltip title="Edit">
                <Button onClick={() => setShowDrawer(true)} icon={<EditOutlined />} type="text" shape="circle" />
              </Tooltip>
              <Tooltip title="Delete">
                <Popconfirm title="Are you sure to delete this?" onConfirm={() => remove(feed?.id)}>
                  <Button icon={<DeleteOutlined />} danger type="text" shape="circle" />
                </Popconfirm>
              </Tooltip>
            </Space> : null}>
              <Card.Meta
                title={feed?.pet?.name}
                avatar={<Avatar src={feed?.pet?.avatar_url} />}
                description={moment(feed?.created_at).fromNow()} />
              {feed?.caption ? <div>
                <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', margin: '15px 0 0 0' }}>
                  {feed?.caption}
                </Typography.Paragraph>
              </div> : ''}
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
    <Drawer title="Update" closable placement="right" visible={showDrawer} onClose={() => setShowDrawer(false)}>
      <Form layout="vertical" form={form} onFinish={finish}>
        <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} label="Pet" name="pet_id" rules={[{ required: true, message: 'Please select the pet' }]}>
          <Select size="large">
            {pets?.map(pet => <Select.Option value={pet.id}><Avatar src={pet.avatar_url} style={{ marginRight: '10px' }} /> {pet.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="caption" label="Caption">
          <Input.TextArea />
        </Form.Item>
        <Form.Item style={{ marginTop: '20px', float: 'right' }}>
          <Button type="primary" icon={<EditOutlined />} htmlType="submit">Update</Button>
        </Form.Item>
      </Form>
    </Drawer>
    <Navigation page="main" />
  </>
}

export default Feed