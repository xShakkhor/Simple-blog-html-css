import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, MapPin, Clock, Wifi, Monitor, X } from 'lucide-react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

export default function UserInfoPanel() {
  const { isExplored } = usePortfolioStore()
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isExplored) return

    const fetchUserInfo = async () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const locale = navigator.language || 'en-US'
      const platform = navigator.platform || 'Unknown'
      const cores = navigator.hardwareConcurrency || 'Unknown'
      const memory = navigator.deviceMemory || 'Unknown'
      
      const userAgent = navigator.userAgent
      let browser = 'Unknown'
      if (userAgent.includes('Chrome')) browser = 'Chrome'
      else if (userAgent.includes('Firefox')) browser = 'Firefox'
      else if (userAgent.includes('Safari')) browser = 'Safari'
      else if (userAgent.includes('Edge')) browser = 'Edge'
      
      const localInfo = {
        ip: 'Local Session',
        city: timezone.split('/')[1]?.replace('_', ' ') || 'Local',
        country: locale.split('-')[1] || 'Unknown',
        timezone: timezone,
        org: `${browser} on ${platform}`,
        cores: cores,
        memory: memory,
        language: locale,
      }
      
      setUserInfo(localInfo)
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
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className={`absolute z-30 glass-panel flex items-center gap-2 transition-colors hover:bg-cosmic-violet/20
            ${isMobile ? 'bottom-4 left-4 h-9 px-2' : 'bottom-24 left-4 h-10 px-3'}`}
          title="User Info"
        >
          <Monitor size={isMobile ? 14 : 16} className="text-cosmic-violet" />
          {!isMobile && <span className="text-[10px] font-mono tracking-[0.18em] text-muted-slate">USER INFO</span>}
        </button>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`absolute z-30 glass-panel p-3 sm:p-4 
              ${isMobile 
                ? 'left-2 right-2 bottom-16 w-auto' 
                : 'bottom-24 left-4 w-72'}`}
          >
            <div className="mb-3 flex items-start justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <Globe size={14} sm={16} className="text-cosmic-violet" />
                <div>
                  <span className="text-sm font-mono text-gradient">USER INFO</span>
                  {!isMobile && (
                    <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-slate">Ambient session details</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isMobile && <span className="text-xs text-muted-slate">{getTimeGreeting()}</span>}
                <button
                  onClick={() => setIsVisible(false)}
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-slate transition-colors hover:border-cosmic-violet/40 hover:text-text-white"
                  title="Hide user info"
                >
                  <X size={12} sm={13} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-cosmic-violet border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className={`space-y-2 ${isMobile ? 'grid grid-cols-2 gap-2' : 'space-y-3'}`}>
                <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-white/8 bg-white/5 p-2 sm:p-3">
                  <Wifi size={12} sm={14} className="text-plasma-green" />
                  <div>
                    <div className="text-[10px] sm:text-xs text-muted-slate">Session</div>
                    <div className="text-xs sm:text-sm font-mono text-text-white">{userInfo?.ip || 'Local Session'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-white/8 bg-white/5 p-2 sm:p-3">
                  <MapPin size={12} sm={14} className="text-star-gold" />
                  <div>
                    <div className="text-[10px] sm:text-xs text-muted-slate">Timezone</div>
                    <div className="text-xs sm:text-sm text-text-white">{userInfo?.timezone?.split('/')[1]?.replace('_', ' ') || userInfo?.timezone || 'Unknown'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-white/8 bg-white/5 p-2 sm:p-3">
                  <Clock size={12} sm={14} className="text-cyan-nebula" />
                  <div>
                    <div className="text-[10px] sm:text-xs text-muted-slate">Local Time</div>
                    <div className="text-xs sm:text-sm font-mono text-text-white">
                      {formatTime(userInfo?.timezone)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-white/8 bg-white/5 p-2 sm:p-3">
                  <Monitor size={12} sm={14} className="text-cosmic-violet" />
                  <div>
                    <div className="text-[10px] sm:text-xs text-muted-slate">Browser</div>
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
