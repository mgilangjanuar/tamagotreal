import { LogoutOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Empty, Form, List, Row, Typography } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import JSCookie from 'js-cookie'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Navigation from '../../components/Navigation'
import { useFind as useFindFeeds } from '../../hooks/feed/useFind'
import { useFind } from '../../hooks/pet/useFind'
import { PetForm } from './components/PetForm'

interface Props {
  user: any
}

const Profile: React.FC<Props> = ({ user }) => {
  const history = useHistory()
  const [form] = useForm()
  const [getPets, pets] = useFind()
  const [data, setData] = useState<any[]>()
  const [offset, setOffset] = useState<number>(0)
  const [find, feeds, error, reset] = useFindFeeds()

  const size = 8

  useEffect(() => {
    if (user) {
      getPets({ owner: user?.email })
    }
  }, [user])

  useEffect(() => {
    form.setFieldsValue({
      pets: pets.map(pet => ({ ...pet, birth_date: pet.birth_date ? moment(pet.birth_date, 'YYYY-MM-DD') : null }))
    })
  }, [pets])

  useEffect(() => {
    setData([...data || [], ...feeds.filter(feed => !data?.find(d => d.id === feed.id))])
  }, [feeds])

  useEffect(() => reset(), [offset])

  useEffect(() => {
    if (error === undefined && user) {
      find({ rangeFrom: offset, rangeTo: offset + size, owner: user.email })
    }
  }, [error, user])

  const logout = () => {
    JSCookie.remove('authorization')
    JSCookie.remove('refresh_token')
    history.replace('/')
  }
  return <Row style={{ minHeight: '85vh', padding: '20px 0' }}>
    <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
      <Typography.Title level={2}>
        My Pets
        <Button style={{ float: 'right' }} danger type="text" onClick={logout} icon={<LogoutOutlined />} />
      </Typography.Title>
      <Form form={form} layout="vertical">
        <Form.List name="pets">
          {(fields, { add, remove }) => <>
            {!fields?.length ? <Empty style={{ marginBottom: '20px' }} /> : ''}
            {fields.map((field, index) => <PetForm key={index} field={field} removeField={remove} form={form} index={index} />)}
            <Form.Item wrapperCol={{ span: 24 }} style={{ marginTop: '5px' }}>
              <Button size="large" shape="round" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Pet
              </Button>
            </Form.Item>
          </>}
        </Form.List>
      </Form>

      <List dataSource={data}
        loading={error === undefined}
        loadMore={<div style={{ textAlign: 'center', margin: '15px 10px 40px' }}>
          <Button shape="round"
            disabled={!feeds?.length || feeds?.length <= size}
            onClick={() => setOffset(data?.length || 0)}>
            {!feeds?.length || feeds?.length <= size ? 'End of Page' : 'Load More'}
          </Button>
        </div>}
        renderItem={feed => <Link to={`/feed/${feed.id}`}>
          <img style={{ cursor: 'pointer', width: '31%', margin: '1.13%' }} alt={feed.url} src={feed.url} />
        </Link>} />
    </Col>
    <Navigation page="profile" />
  </Row>
}

export default Profile