import { Button, Col, List, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../../components/Navigation'
import { useFind } from '../../hooks/feed/useFind'
import { FeedCard } from './components/FeedCard'

interface Props {
  user: any
}

const Main: React.FC<Props> = ({ user }) => {
  const [data, setData] = useState<any[]>()
  const [offset, setOffset] = useState<number>(0)
  const [find, feeds, error, reset] = useFind()

  const size = 8

  useEffect(() => {
    if (error === undefined) {
      find({ rangeFrom: offset, rangeTo: offset + size })
    }
  }, [error])

  useEffect(() => {
    setData([...data || [], ...feeds.filter(feed => !data?.find(d => d.id === feed.id))])
  }, [feeds])

  useEffect(() => reset(), [offset])

  return <Row style={{ minHeight: '85vh', padding: '0 0 70px' }}>
    <Col lg={{ span: 8, offset: 8 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
      <List dataSource={data}
        loading={error === undefined}
        loadMore={<div style={{ textAlign: 'center' }}>
          <Button shape="round"
            disabled={!feeds?.length || feeds?.length <= size}
            onClick={() => setOffset(data?.length || 0)}>
            {!feeds?.length || feeds?.length <= size ? 'End of Page' : 'Load More'}
          </Button>
        </div>}
        renderItem={feed => <List.Item key={feed.id}>
          <Link style={{ width: '100%' }} to={`/feed/${feed.id}`}>
            <FeedCard feed={feed} user={user}
              onAfterUpdate={newFeed => setData(data?.map(d => d.id === newFeed.id ? { ...newFeed, pet: d.pet } : d))} />
          </Link>
        </List.Item>} />
    </Col>
    <Navigation page="main" />
  </Row>
}
export default Main