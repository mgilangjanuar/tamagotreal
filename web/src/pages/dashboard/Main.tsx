import { CommentOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, List, Row, Typography } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
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
  const [like, feed, errorLike, resetLike] = useLike()
  const history = useHistory()

  const size = 1

  useEffect(() => {
    if (error === undefined) {
      find({ rangeFrom: offset, rangeTo: offset + size })
    }
  }, [error])

  useEffect(() => {
    resetLike()
  }, [errorLike])

  useEffect(() => {
    setData([...data || [], ...feeds.filter(feed => !data?.find(d => d.id === feed.id))])
  }, [feeds])

  useEffect(() => {
    if (feed) {
      setData(data?.map(d => d.id === feed.id ? { ...feed, pet: d.pet } : d))
    }
  }, [feed])

  useEffect(() => {
    reset()
  }, [offset])

  const likeFeed = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    like(id)
  }

  return <Row style={{ minHeight: '85vh', padding: '0 0 70px' }}>
    <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
      <List dataSource={data}
        loading={error === undefined}
        loadMore={<div style={{ textAlign: 'center' }}>
          <Button shape="round" disabled={!feeds?.length} onClick={() => setOffset(data?.length || 0)}>{feeds?.length ? 'Load More' : 'End of Page'}</Button>
        </div>}
        renderItem={feed => <List.Item key={feed.id}>
          <Card onClick={() => history.push(`/feed/${feed.id}`)} style={{ width: '100%' }} hoverable cover={<img src={feed.url} alt={feed.url} />} actions={[
            <Button key="like" onClick={e => likeFeed(e, feed.id)} type="text" danger icon={feed.likes?.includes(user.email) ? <HeartFilled /> : <HeartOutlined />}> &nbsp;{feed.likes?.length || 0}</Button>,
            <Button key="comment" type="text" icon={<CommentOutlined />}></Button>
          ]}>
            <Card.Meta
              title={feed.pet.name}
              avatar={<Avatar src={feed.pet.avatar_url} />}
              description={moment(feed.created_at).fromNow()} />
            {feed.caption ? <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              <Typography.Paragraph style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', margin: '15px 0 0 0' }}>
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