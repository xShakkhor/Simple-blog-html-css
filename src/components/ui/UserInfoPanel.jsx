import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, MapPin, Clock, Wifi, Monitor, Eye, EyeOff } from 'lucide-react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

export default function UserInfoPanel() {
  const { isExplored } = usePortfolioStore()
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!isExplored) return

    const fetchUserInfo = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        setUserInfo(data)
      } catch (error) {
        setUserInfo({
          ip: 'Unknown',
          city: 'Unknown',
          country: 'Unknown',
          timezone: 'Unknown',
          org: 'Unknown',
          asn: 'Unknown'
        })
      }
      setLoading(false)
    }

    fetchUserInfo()
  }, [isExplored])

  if (!isExplored) return null

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const formatTime = (timezone) => {
    if (!timezone) return '--:--'
    try {
      return new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit' })
    } catch {
      return '--:--'
    }
  }

  const formatDate = (timezone) => {
    if (!timezone) return '---'
    try {
      return new Date().toLocaleDateString('en-US', { timeZone: timezone, weekday: 'short', month: 'short', day: 'numeric' })
    } catch {
      return '---'
    }
  }

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute bottom-24 left-4 z-30 glass-panel w-10 h-10 flex items-center justify-center hover:bg-cosmic-violet/30 transition-colors"
        title="User Info"
      >
        <Monitor size={18} className={isVisible ? 'text-cosmic-violet' : 'text-muted-slate'} />
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute bottom-24 left-16 z-30 glass-panel p-4 w-64"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-cosmic-violet" />
                <span className="text-sm font-mono text-gradient">USER INFO</span>
              </div>
              <span className="text-xs text-muted-slate">{getTimeGreeting()}</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-cosmic-violet border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <Wifi size={14} className="text-plasma-green" />
                  <div>
                    <div className="text-xs text-muted-slate">IP Address</div>
                    <div className="text-sm text-text-white font-mono">{userInfo?.ip || 'Loading...'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <MapPin size={14} className="text-star-gold" />
                  <div>
                    <div className="text-xs text-muted-slate">Location</div>
                    <div className="text-sm text-text-white">
                      {userInfo?.city}, {userInfo?.country}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <Clock size={14} className="text-cyan-nebula" />
                  <div>
                    <div className="text-xs text-muted-slate">Time</div>
                    <div className="text-sm text-text-white font-mono">
                      {formatTime(userInfo?.timezone)}
                      <span className="text-xs text-muted-slate ml-2">
                        {formatDate(userInfo?.timezone)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <Monitor size={14} className="text-cosmic-violet" />
                  <div>
                    <div className="text-xs text-muted-slate">Network</div>
                    <div className="text-xs text-text-white truncate">
                      {userInfo?.org || 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
