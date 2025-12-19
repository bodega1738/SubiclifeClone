'use client'

import { Notification } from '@/lib/types'
import { 
  TrendingUp, 
  CheckCircle, 
  MapPin, 
  Award,
  Circle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ActivityTimelineProps {
  activities: Notification[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'points_earned':
        return { icon: TrendingUp, color: 'bg-green-100 text-green-600' }
      case 'booking_confirmed':
        return { icon: CheckCircle, color: 'bg-blue-100 text-blue-600' }
      case 'check_in':
        return { icon: MapPin, color: 'bg-purple-100 text-purple-600' }
      case 'tier_upgraded':
        return { icon: Award, color: 'bg-yellow-100 text-yellow-600' }
      default:
        return { icon: Circle, color: 'bg-gray-100 text-gray-600' }
    }
  }

  if (activities.length === 0) {
    return (
      <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-sm text-gray-500">No recent activity found</p>
      </div>
    )
  }

  return (
    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-100 before:via-gray-200 before:to-gray-100">
      {activities.map((activity, index) => {
        const config = getActivityIcon(activity.type)
        return (
          <div key={activity.id} className="relative flex items-start gap-4">
            <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm ${config.color}`}>
              <config.icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col flex-1 pt-0.5">
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                  {activity.title}
                </h4>
                <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap pt-0.5">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {activity.message}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
