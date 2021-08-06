import { CommentOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons'
import { Button, Card, Col, Layout, Row, Typography } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import moment from 'moment'
import React, { useEffect } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Navigation from '../../components/Navigation'
import { useLike } from '../../hooks/feed/useLike'
import { useRetrieve } from '../../hooks/feed/useRetrieve'
import { useMe } from '../../hooks/useMe'

interface PageProps extends RouteComponentProps<{
  id: string
}> {}

const Feed: React.FC<PageProps> = ({ match }) => {
  const history = useHistory()
  const [user] = useMe()
  const [retrieve, feed, error, reset] = useRetrieve()
  const [like, feedLike] = useLike()

  useEffect(() => {
    if (user === null) {
      history.replace('/')
    }
  }, [history, user])

  useEffect(() => {
    if (feedLike) {
      reset()
    }
  }, [feedLike])

  useEffect(() => {
    if (error === undefined) {
      retrieve(match.params.id)
    }
  }, [error])

  return <>
    <Navbar />
    <Layout style={{ flexDirection: 'row' }}>
      <Layout.Content style={{ padding: '10px 10px 24px', margin: 0, minHeight: 280 }}>
        <Row style={{ minHeight: '85vh', padding: '0 0 70px' }}>
          <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
            <Card hoverable cover={<img src={feed?.url} alt={feed?.url} />} actions={[
              <Button key="like" onClick={() => like(feed?.id)} type="text" danger icon={feed?.likes?.includes(user.email) ? <HeartFilled /> : <HeartOutlined />}> &nbsp;{feed?.likes?.length || 0}</Button>,
              <Button key="comment" type="text" icon={<CommentOutlined />}></Button>
            ]}>
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
    <Navigation page="main" />
  </>
}

export default Feed