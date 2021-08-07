import { CommentOutlined, DeleteOutlined, EditOutlined, HeartFilled, HeartOutlined, SendOutlined } from '@ant-design/icons'
import { Button, Card, Col, Drawer, Form, Input, Layout, List, message, Popconfirm, Row, Select, Space, Spin, Tooltip, Typography } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import { useForm } from 'antd/lib/form/Form'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Navigation from '../../components/Navigation'
import { useCreate } from '../../hooks/comment/useCreate'
import { useFind as useFindComments } from '../../hooks/comment/useFind'
import { useRemove } from '../../hooks/comment/useRemove'
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
  const [offset, setOffset] = useState<number>(0)
  const [showDrawer, setShowDrawer] = useState<boolean>()
  const [user] = useMe()
  const [retrieve, feed, error, reset] = useRetrieve()
  const [update, errorUpdate, resetUpdate] = useUpdate()
  const [like, loadingLike, feedLike] = useLike()
  const [remove, errorRemove] = useDelete()
  const [form] = useForm()
  const [formComment] = useForm()
  const [findPets, pets] = useFind()
  const [createComment, comment, errorComment, resetComment] = useCreate()
  const [commentsData, setCommentsData] = useState<any[]>()
  const [findComments, comments, errorComments, resetComments] = useFindComments()
  const [removeComment, commentRemoved, errorRemoveComment, resetRemoveComment] = useRemove()

  const commentSize = 8

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
    if (feed) {
      formComment.setFieldsValue({
        feed_id: feed?.id,
        pet_id: localStorage.getItem('defaultPetId') || pets?.[0]?.id || null
      })
    }
  }, [feed, pets])

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

  useEffect(() => {
    if (errorComments === undefined) {
      findComments({ feed_id: match.params.id, rangeFrom: offset, rangeTo: offset + commentSize })
    }
  }, [errorComments])

  useEffect(() => {
    if (errorComment) {
      message.error(errorComment?.data.error || 'Something error')
    } else if (errorComment === null) {
      message.success('Created')
    }
    resetComment()
  }, [errorComment])

  useEffect(() => {
    setCommentsData([...commentsData || [], ...comments.filter(comment => !commentsData?.find(d => d.id === comment.id))])
  }, [comments])

  useEffect(() => {
    if (comment) {
      setCommentsData([
        {
          ...comment,
          pet: pets?.find(p => p.id === formComment.getFieldValue('pet_id'))
        },
        ...(commentsData || []).filter(d => d.id !== comment.id)
      ])
      formComment.setFieldsValue({ content: null })
    }
  }, [comment])

  useEffect(() => {
    resetComments()
  }, [offset])

  const finishComment = () => {
    localStorage.setItem('defaultPetId', formComment.getFieldValue('pet_id'))
    createComment(formComment.getFieldsValue())
  }

  useEffect(() => {
    console.log('OASNAKSSA', errorRemoveComment, commentRemoved)
    if (errorRemoveComment) {
      message.error(errorComment?.data.error || 'Something error')
    } else if (errorRemoveComment === null) {
      message.success('Deleted')
    }
    resetRemoveComment()
  }, [errorRemoveComment])

  useEffect(() => {
    if (commentRemoved) {
      setCommentsData(commentsData?.filter(data => data.id !== commentRemoved.id))
    }
  }, [commentRemoved])

  return <>
    <Navbar />
    <Layout style={{ flexDirection: 'row' }}>
      <Layout.Content style={{ padding: '10px 10px 24px', margin: 0, minHeight: 280 }}>
        <Row style={{ minHeight: '85vh', padding: '0 0 70px' }}>
          <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
            <Card hoverable cover={<img src={feed?.url} alt={feed?.url} />} actions={[
              <Button disabled={loadingLike} key="like"
                onClick={() => like(feed?.id)} type="text" danger
                icon={loadingLike ? <Spin /> : feed?.likes?.includes(user?.email) ? <HeartFilled /> : <HeartOutlined />}>
                &nbsp; {feed?.likes?.length || 0}
              </Button>,
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
                <Typography.Paragraph style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', margin: '15px 0 0 0' }}>
                  {feed?.caption}
                </Typography.Paragraph>
              </div> : ''}
            </Card>

            <Card title={`Comments (${commentsData?.length}${(commentsData?.length || 0) > 0 ? '+' : ''})`}>
              <Form layout="horizontal" form={formComment} onFinish={finishComment}>
                <Form.Item label="Comment as" wrapperCol={{ span: 18 }} labelCol={{ span: 6 }} name="pet_id" rules={[{ required: true, message: 'Please select the pet' }]}>
                  <Select>
                    {pets?.map(pet => <Select.Option value={pet.id}>{pet.name}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Form.Item name="content" rules={[{ required: true, message: 'Please input the content' }]}>
                  <Input.TextArea />
                </Form.Item>
                <Form.Item name="feed_id" hidden>
                  <Input />
                </Form.Item>
                <Form.Item style={{ float: 'right' }}>
                  <Button shape="round" htmlType="submit">Comment <SendOutlined /></Button>
                </Form.Item>
              </Form>
            </Card>

            <List dataSource={commentsData}
              loading={errorComments === undefined}
              loadMore={<div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button shape="round"
                  disabled={!comments?.length || comments?.length <= commentSize}
                  onClick={() => setOffset(commentsData?.length || 0)}>
                  {!comments?.length || comments?.length <= commentSize ? 'End of Page' : 'Load More'}
                </Button>
              </div>}
              renderItem={comment => <List.Item key={comment?.id} style={{ padding: '0' }}>
                <Card bordered={false} style={{ width: '100%' }}>
                  {user?.email === comment.owner ? <div style={{ float: 'right' }}>
                    <Popconfirm title="Are you sure to delete this?" onConfirm={() => removeComment(comment?.id)}>
                      <Button icon={<DeleteOutlined />} danger type="text" shape="circle" />
                    </Popconfirm>
                  </div> : ''}
                  <Card.Meta
                    title={comment?.pet.name}
                    avatar={<Avatar src={comment?.pet.avatar_url} />}
                    description={moment(comment.started_at).fromNow()} />
                  <div>
                    <Typography.Paragraph style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', margin: '15px 0 0 0' }}>
                      {comment?.content}
                    </Typography.Paragraph>
                  </div>
                </Card>
              </List.Item>} />
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