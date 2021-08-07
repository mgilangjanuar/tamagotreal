import { DeleteOutlined, SendOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, Layout, List, message, Popconfirm, Row, Select, Typography } from 'antd'
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
import { useRetrieve } from '../../hooks/feed/useRetrieve'
import { useFind } from '../../hooks/pet/useFind'
import { useMe } from '../../hooks/useMe'
import { FeedCard } from './components/FeedCard'

interface PageProps extends RouteComponentProps<{
  id: string
}> {}

const Feed: React.FC<PageProps> = ({ match }) => {
  const [offset, setOffset] = useState<number>(0)
  const [commentsData, setCommentsData] = useState<any[]>()
  const [feed, setFeed] = useState<any>()
  const history = useHistory()
  const [user] = useMe()
  const [retrieve, feedData, error] = useRetrieve()
  const [formComment] = useForm()
  const [findPets, pets] = useFind()
  const [createComment, loadingComment, comment, errorComment, resetComment] = useCreate()
  const [findComments, comments, errorComments, resetComments] = useFindComments()
  const [removeComment, loadingRemoveComment, commentRemoved, errorRemoveComment, resetRemoveComment] = useRemove()

  const commentSize = 8

  useEffect(() => {
    if (user === null) {
      return history.replace('/')
    }
    findPets({ owner: user?.email })
  }, [history, user])

  useEffect(() => setFeed(feedData), [feedData])

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

  useEffect(() => resetComments(), [offset])

  const finishComment = () => {
    localStorage.setItem('defaultPetId', formComment.getFieldValue('pet_id'))
    createComment(formComment.getFieldsValue())
  }

  useEffect(() => {
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
    <Navbar back />
    <Layout style={{ flexDirection: 'row' }}>
      <Layout.Content style={{ padding: '10px 10px 24px', margin: 0, minHeight: 280 }}>
        <Row style={{ minHeight: '85vh', padding: '0 0 70px' }}>
          <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
            <FeedCard feed={feed} user={user} pets={pets} onAfterUpdate={newFeed => setFeed({ ...newFeed, pet: feed.pet })} useExtra />

            <br />
            <Card title={`Comments (${commentsData?.length}${!comments?.length || comments?.length <= commentSize ? '' : '+'})`}>
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
                  <Button loading={loadingComment} shape="round" htmlType="submit">Comment <SendOutlined /></Button>
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
                    <Popconfirm disabled={loadingRemoveComment === comment.id} title="Are you sure to delete this?" onConfirm={() => removeComment(comment?.id)}>
                      <Button loading={loadingRemoveComment === comment.id} icon={<DeleteOutlined />} danger type="text" shape="circle" />
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
    <Navigation page="main" />
  </>
}

export default Feed