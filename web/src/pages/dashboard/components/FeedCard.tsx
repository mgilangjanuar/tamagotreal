import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined,
  ShareAltOutlined
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Popover,
  Select,
  Space,
  Tooltip,
  Typography
} from 'antd'
import { useForm } from 'antd/lib/form/Form'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share'
import { useLike } from '../../../hooks/feed/useLike'
import { useRemove } from '../../../hooks/feed/useRemove'
import { useUpdate } from '../../../hooks/feed/useUpdate'

interface Props {
  feed: any,
  user: any,
  pets?: any[],
  onAfterUpdate?: (feedLike: any) => void,
  onClickComment?: () => void,
  useExtra?: boolean
}

export const FeedCard: React.FC<Props> = ({ feed, user, pets, onAfterUpdate, onClickComment, useExtra }) => {
  const [like, loadingLike, feedLike, errorLike, resetLike] = useLike()
  const [remove, loadingRemove, errorRemove] = useRemove()
  const [update, loadingUpdate, feedUpdate, errorUpdate, resetUpdate] = useUpdate()
  const [showDrawer, setShowDrawer] = useState<boolean>()
  const history = useHistory()
  const [form] = useForm()

  const likeFeed = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    like(id)
  }

  useEffect(() => resetLike(), [errorLike])

  useEffect(() => {
    if (feedLike) {
      onAfterUpdate?.(feedLike)
    }
  }, [feedLike])

  useEffect(() => {
    if (errorRemove === null) {
      history.goBack()
    }
  }, [errorRemove])

  useEffect(() => {
    if (feedUpdate) {
      onAfterUpdate?.(feedUpdate)
    }
  }, [feedUpdate])

  useEffect(() => {
    if (errorUpdate === null) {
      message.success('Updated')
      setShowDrawer(false)
    }
    resetUpdate()
  }, [errorUpdate])

  useEffect(() => form.setFieldsValue(feed), [feed])

  const shareProps = {
    title: feed?.caption || 'Hey, check this out! So adorable ♥️',
    description: feed?.caption || 'Hey, check this out! So adorable ♥️',
    url: `${process.env.REACT_APP_API_URL}/feed/${feed?.id}`,
    style: {
      margin: '0 3px'
    }
  }

  return <>
    <Card loading={!feed} hoverable cover={<img src={feed?.url} alt={feed?.url} />} actions={[
      <Button block loading={loadingLike === feed?.id} key="like"
        onClick={e => likeFeed(e, feed?.id)} type="text" danger
        icon={feed?.likes?.includes(user?.email) ? <HeartFilled /> : <HeartOutlined />}>
        &nbsp; {feed?.likes?.length || 0}
      </Button>,
      <Button onClick={() => onClickComment?.()} block key="comment" type="text" icon={<CommentOutlined />}></Button>,
      <Popover title="Share to" trigger="click" placement="bottomRight" content={<div>
        <TwitterShareButton {...shareProps}>
          <TwitterIcon round size={32} />
        </TwitterShareButton>
        <WhatsappShareButton {...shareProps}>
          <WhatsappIcon round size={32} />
        </WhatsappShareButton>
        <LineShareButton {...shareProps}>
          <LineIcon round size={32} />
        </LineShareButton>
        <TelegramShareButton {...shareProps}>
          <TelegramIcon round size={32} />
        </TelegramShareButton>
        <PinterestShareButton {...shareProps} media={feed?.url}>
          <PinterestIcon round size={32} />
        </PinterestShareButton>
        <RedditShareButton {...shareProps}>
          <RedditIcon round size={32} />
        </RedditShareButton>
        <LinkedinShareButton {...shareProps}>
          <LinkedinIcon round size={32} />
        </LinkedinShareButton>
      </div>}>
        <Button block key="share" type="text" icon={<ShareAltOutlined />}></Button>
      </Popover>
    ]}
    extra={useExtra && feed?.owner === user?.email ? <Space>
      <Tooltip title="Edit">
        <Button onClick={() => setShowDrawer(true)} icon={<EditOutlined />} type="text" shape="circle" />
      </Tooltip>
      <Tooltip title="Delete">
        <Popconfirm title="Are you sure to delete this?" onConfirm={() => remove(feed?.id)}>
          <Button loading={loadingRemove === feed?.id} icon={<DeleteOutlined />} danger type="text" shape="circle" />
        </Popconfirm>
      </Tooltip>
    </Space> : null}>
      <Card.Meta
        title={feed?.pet?.name}
        avatar={<Avatar src={feed?.pet?.avatar_url} />}
        description={moment(feed?.created_at).fromNow()} />
      {feed?.caption ? <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        <Typography.Paragraph style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', margin: '15px 0 0 0' }}>
          {feed?.caption}
        </Typography.Paragraph>
      </div> : ''}
    </Card>
    <Drawer title="Update" closable placement="right" visible={showDrawer} onClose={() => setShowDrawer(false)}>
      <Form layout="vertical" form={form} onFinish={() => update(feed?.id, form.getFieldsValue())}>
        <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} label="Pet" name="pet_id" rules={[{ required: true, message: 'Please select the pet' }]}>
          <Select size="large">
            {pets?.map(pet => <Select.Option value={pet.id}><Avatar src={pet.avatar_url} style={{ marginRight: '10px' }} /> {pet.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="caption" label="Caption">
          <Input.TextArea />
        </Form.Item>
        <Form.Item style={{ marginTop: '20px', float: 'right' }}>
          <Button loading={loadingUpdate === feed?.id} type="primary" icon={<EditOutlined />} htmlType="submit">Update</Button>
        </Form.Item>
      </Form>
    </Drawer>
  </>
}