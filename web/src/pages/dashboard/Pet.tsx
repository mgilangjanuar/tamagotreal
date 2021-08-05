import { Col, Row, Typography } from 'antd'
import React from 'react'

interface Props {
  user: any
}

const Pet: React.FC<Props> = ({ user }) => {
  return <Row style={{ minHeight: '85vh', padding: '20px 0' }}>
    <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
      <Typography.Title level={2}>My Pets</Typography.Title>

    </Col>
  </Row>
}
export default Pet