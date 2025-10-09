/**
 * 证书/资质物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'

interface CertificationItemProps {
  style?: React.CSSProperties
  name?: string
  issuer?: string
  date?: string
  credentialId?: string
}

const CertificationItem: React.FC<CertificationItemProps> = ({ 
  style,
  name = '证书名称',
  issuer = '颁发机构',
  date = '2023.06',
  credentialId = '',
}) => {
  const theme = useThemeConfig()
  
  return (
    <div style={{ 
      marginBottom: `${theme.spacing.item - 2}px`,
      ...style 
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '16px',
      }}>
        <div style={{ flex: 1 }}>
          <span style={{ 
            fontSize: `${theme.font.titleSize.h3}px`,
            fontWeight: theme.font.weight.semibold,
            color: theme.color.text.primary,
          }}>
            {name}
          </span>
          <span style={{
            fontSize: `${theme.font.bodySize.normal}px`,
            color: theme.color.text.secondary,
            marginLeft: `${theme.spacing.line + 4}px`,
          }}>
            · {issuer}
          </span>
        </div>
        
        <span style={{ 
          fontSize: `${theme.font.bodySize.small}px`,
          color: theme.color.text.tertiary,
          whiteSpace: 'nowrap',
        }}>
          {date}
        </span>
      </div>
      
      {credentialId && (
        <div style={{
          fontSize: `${theme.font.bodySize.small}px`,
          color: theme.color.text.tertiary,
          marginTop: '2px',
        }}>
          证书编号：{credentialId}
        </div>
      )}
    </div>
  )
}

export const CertificationItemMaterial: IMaterialDefinition = {
  meta: {
    type: 'CertificationItem',
    title: '证书/资质',
    description: '专业证书和资格认证',
    category: 'resume',
    tags: ['简历', '证书', '资质'],
    version: '1.0.0',
  },
  component: CertificationItem,
  propsSchema: [
    {
      name: 'name',
      label: '证书名称',
      type: 'string',
      defaultValue: '证书名称',
      required: true,
      group: '内容',
    },
    {
      name: 'issuer',
      label: '颁发机构',
      type: 'string',
      defaultValue: '颁发机构',
      required: true,
      group: '内容',
    },
    {
      name: 'date',
      label: '获得时间',
      type: 'string',
      defaultValue: '2023.06',
      group: '内容',
    },
    {
      name: 'credentialId',
      label: '证书编号',
      type: 'string',
      defaultValue: '',
      group: '内容',
    },
  ],
  defaultProps: {
    name: '证书名称',
    issuer: '颁发机构',
    date: '2023.06',
    credentialId: '',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}

