import { CommentOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, List, Row, Typography } from 'antd'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useState } from 'react'
import Navigation from '../../components/Navigation'
import { useFind } from '../../hooks/feed/useFind'
import { useLike } from '../../hooks/feed/useLike'

interface Props {
  user: any
}

const Main: React.FC<Props> = ({ user }) => {
  const [data, setData] = useState<any[]>()
  const [offset, setOffset] = useState<number>(0)
  const [find, feeds, error, reset] = useFind()
  const [like, errorLike, resetLike] = useLike()

  const size = 9

  useEffect(() => {
    if (error === undefined) {
      find({ rangeFrom: offset, rangeTo: offset + size })
    }
  }, [error])

  useEffect(() => {
    if (errorLike === null) {
      reset()
    }
    resetLike()
  }, [errorLike])

  useEffect(() => {
    setData([...data || [], ...feeds])
  }, [feeds])

  useEffect(() => {
    reset()
  }, [offset])

  const likeFeed = (id: string) => {
    like(id)
  }

  const loadMore = () => {
    setOffset(offset + size + 1)
  }

  return <Row style={{ minHeight: '85vh', padding: '0 0 70px' }}>
    <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
      <List dataSource={data} loading={error === undefined}
        loadMore={<div style={{ textAlign: 'center' }}>
          <Button disabled={!feeds?.length} onClick={loadMore}>{feeds?.length ? 'Load More' : 'End of Page'}</Button>
        </div>}
        renderItem={feed => <List.Item>
          <Card hoverable cover={<img src={feed.url} alt={feed.url} />} actions={[
            <Button key="like" onClick={() => likeFeed(feed.id)} type="text" danger icon={feed.likes?.includes(user.email) ? <HeartFilled /> : <HeartOutlined />}> &nbsp;{feed.likes?.length || 0}</Button>,
            <Button key="comment" type="text" icon={<CommentOutlined />}></Button>
          ]}>
            <Card.Meta
              title={feed.pet.name}
              avatar={<Avatar src={feed.pet.avatar_url} />}
              description={moment(feed.created_at).fromNow()} />
            {feed.caption ? <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', margin: '15px 0 0 0' }}>
                {feed.caption}
              </Typography.Paragraph>
            </div> : ''}
          </Card>
        </List.Item>} />
    </Col>
    <Navigation page="main" />
  </Row>
}
export default Main