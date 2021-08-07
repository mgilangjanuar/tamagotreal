import { CommentOutlined, HeartFilled, HeartOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, List, Popover, Row, Typography } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LineIcon, LineShareButton, LinkedinIcon, LinkedinShareButton, PinterestIcon, PinterestShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share'
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
  const [like, loadingLike, feed, errorLike, resetLike] = useLike()

  const size = 8

  useEffect(() => {
    if (error === undefined) {
      find({ rangeFrom: offset, rangeTo: offset + size })
    }
  }, [error])

  useEffect(() => resetLike(), [errorLike])

  useEffect(() => {
    setData([...data || [], ...feeds.filter(feed => !data?.find(d => d.id === feed.id))])
  }, [feeds])

  useEffect(() => {
    if (feed) {
      setData(data?.map(d => d.id === feed.id ? { ...feed, pet: d.pet } : d))
    }
  }, [feed])

  useEffect(() => reset(), [offset])

  const likeFeed = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    like(id)
  }

  const shareProps = (feed: any) => ({
    title: feed.caption || 'Hey, check this out! So adorable ♥️',
    description: feed.caption || 'Hey, check this out! So adorable ♥️',
    url: `${process.env.REACT_APP_API_URL}/feed/${feed.id}`,
    style: {
      margin: '0 4px'
    }
  })

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
            <Card hoverable cover={<img src={feed.url} alt={feed.url} />} actions={[
              <Button block loading={loadingLike === feed.id} key="like"
                onClick={e => likeFeed(e, feed.id)} type="text" danger
                icon={feed.likes?.includes(user.email) ? <HeartFilled /> : <HeartOutlined />}>
                &nbsp; {feed.likes?.length || 0}
              </Button>,
              <Button block key="comment" type="text" icon={<CommentOutlined />}></Button>,
              <Popover title="Share to" trigger="click" placement="bottomRight" content={<div>
                <TwitterShareButton {...shareProps(feed)}>
                  <TwitterIcon round size={32} />
                </TwitterShareButton>
                <WhatsappShareButton {...shareProps(feed)}>
                  <WhatsappIcon round size={32} />
                </WhatsappShareButton>
                <LineShareButton {...shareProps(feed)}>
                  <LineIcon round size={32} />
                </LineShareButton>
                <TelegramShareButton {...shareProps(feed)}>
                  <TelegramIcon round size={32} />
                </TelegramShareButton>
                <PinterestShareButton {...shareProps(feed)} media={feed.url}>
                  <PinterestIcon round size={32} />
                </PinterestShareButton>
                <RedditShareButton {...shareProps(feed)}>
                  <RedditIcon round size={32} />
                </RedditShareButton>
                <LinkedinShareButton {...shareProps(feed)}>
                  <LinkedinIcon round size={32} />
                </LinkedinShareButton>
              </div>}>
                <Button block key="share" type="text" icon={<ShareAltOutlined />}></Button>
              </Popover>
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
          </Link>
        </List.Item>} />
    </Col>
    <Navigation page="main" />
  </Row>
}
export default Main