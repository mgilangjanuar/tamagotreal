import React from 'react'
import JSCookie from 'js-cookie'
import { useHistory } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Typography } from 'antd'

interface Props {
  user: any
}

const Profile: React.FC<Props> = ({ user }) => {
  const history = useHistory()

  const logout = () => {
    JSCookie.remove('authorization')
    history.replace('/')
  }
  return <Row style={{ minHeight: '85vh', padding: '20px 0' }}>
    <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
      <Typography.Title level={2}>My Profile</Typography.Title>
      <Form.Item label="Email" wrapperCol={{ span: 24 }} labelCol={{ span: 24 }}>
        <Input value={user?.email} disabled />
      </Form.Item>
      <Button danger block type="primary" onClick={logout}>Logout</Button>
    </Col>
  </Row>
}
export default Profile