import { Col, Row } from 'antd'
import React from 'react'

interface Props {
  user: any
}

const Main: React.FC<Props> = ({ user }) => {
  return <Row style={{ minHeight: '85vh', padding: '20px 0' }}>
    <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>

    </Col>
  </Row>
}
export default Main