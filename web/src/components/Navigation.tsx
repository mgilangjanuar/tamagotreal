import { BugOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import BottomNavigation from 'reactjs-bottom-navigation'
import 'reactjs-bottom-navigation/dist/index.css'


interface Props {
  page: string
}

const Navigation: React.FC<Props> = ({ page }) => {
  const [idx, setIdx] = useState<number>()
  const history = useHistory()

  useEffect(() => {
    if (!page || page === 'main') {
      setIdx(0)
    } else if (page === 'pet') {
      setIdx(1)
    } else if (page === 'profile') {
      setIdx(2)
    }
  }, [page])

  const changePage = (idx: number) => {
    let page = 'main'
    if (idx === 1) {
      page = 'pet'
    } else if (idx === 2) {
      page = 'profile'
    }
    setIdx(idx)
    history.push(`/dashboard/${page}`)
  }

  return <div>
    {!isNaN(Number(idx)) ? <BottomNavigation
      items={[
        {
          title: 'Home',
          icon: <HomeOutlined style={{ fontSize: '18px' }} />,
          activeIcon: <HomeOutlined style={{ fontSize: '18px', color: '#fff' }} />,
          onClick: () => changePage(0)
        },
        {
          title: 'My Pets',
          icon: <BugOutlined style={{ fontSize: '18px' }} />,
          activeIcon: <BugOutlined style={{ fontSize: '18px', color: '#fff' }} />,
          onClick: () => changePage(1)
        },
        {
          title: 'Profile',
          icon: <UserOutlined style={{ fontSize: '18px' }} />,
          activeIcon: <UserOutlined style={{ fontSize: '18px', color: '#fff' }} />,
          onClick: () => changePage(2)
        }
      ]}
      activeBgColor="#001529"
      defaultSelected={idx}
    /> : ''}
  </div>
}

export default Navigation