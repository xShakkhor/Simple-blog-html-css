import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, MapPin, Clock, Wifi, Monitor, X } from 'lucide-react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

export default function UserInfoPanel() {
  const { isExplored } = usePortfolioStore()
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!isExplored) return

    const fetchUserInfo = async () => {
      const apis = [
        {
          url: 'https://ipwho.is/',
          parser: (data) => {
            if (data.success) {
              return {
                ip: data.ip,
                city: data.city,
                country: data.country,
                timezone: data.timezone?.id,
                org: data.connection?.isp || data.connection?.org,
              }
            }
            return null
          },
        },
        {
          url: 'https://ipapi.co/json/',
          parser: (data) => {
            if (data.ip) {
              return {
                ip: data.ip,
                city: data.city,
                country: data.country_name,
                timezone: data.timezone,
                org: data.org,
              }
            }
            return null
          },
        },
        {
          url: 'https://ipapi.com/json/',
          parser: (data) => {
            if (data.ip) {
              return {
                ip: data.ip,
                city: data.city,
                country: data.country_name,
                timezone: data.timezone,
                org: data.org,
              }
            }
            return null
          },
        },
      ]

      for (const api of apis) {
        try {
          console.log('Trying API:', api.url)
          const response = await fetch(api.url)
          console.log('Response status:', response.status, api.url)
          if (response.ok) {
            const data = await response.json()
            console.log('Response data:', data, api.url)
            const parsed = api.parser(data)
            if (parsed && parsed.ip) {
              console.log('Parsed user info:', parsed)
              setUserInfo(parsed)
              setLoading(false)
              return
            }
          }
        } catch (err) {
          console.error('API error:', err.message, api.url)
          continue
        }
      }

      console.log('All APIs failed, using local browser info')
      const localInfo = {
        ip: '127.0.0.1',
        city: 'Local',
        country: 'Network',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        org: 'Local Device',
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

  const locationLabel = userInfo?.city && userInfo?.country
    ? `${userInfo.city}, ${userInfo.country}`
    : 'Location hidden'

  const networkLabel = userInfo?.org || 'Secure relay unavailable'

  return (
    <>
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="absolute bottom-24 left-4 z-30 glass-panel flex h-10 items-center gap-2 px-3 transition-colors hover:bg-cosmic-violet/20"
          title="User Info"
        >
          <Monitor size={16} className="text-cosmic-violet" />
          <span className="text-[10px] font-mono tracking-[0.18em] text-muted-slate">USER INFO</span>
        </button>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute bottom-24 left-4 z-30 w-72 glass-panel p-4"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-cosmic-violet" />
                <div>
                  <span className="text-sm font-mono text-gradient">USER INFO</span>
                  <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-slate">Ambient session details</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-slate">{getTimeGreeting()}</span>
                <button
                  onClick={() => setIsVisible(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-slate transition-colors hover:border-cosmic-violet/40 hover:text-text-white"
                  title="Hide user info"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-cosmic-violet border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-3">
                  <Wifi size={14} className="text-plasma-green" />
                  <div>
                    <div className="text-xs text-muted-slate">IP Address</div>
                    <div className="text-sm font-mono text-text-white">{userInfo?.ip || 'Local relay masked'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-3">
                  <MapPin size={14} className="text-star-gold" />
                  <div>
                    <div className="text-xs text-muted-slate">Location</div>
                    <div className="text-sm text-text-white">{locationLabel}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-3">
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

                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-3">
                  <Monitor size={14} className="text-cosmic-violet" />
                  <div>
                    <div className="text-xs text-muted-slate">Network</div>
                    <div className="text-xs text-text-white truncate">
                      {networkLabel}
                    </div>
                  </div>
                </div>

                {!userInfo && (
                  <div className="rounded-xl border border-dashed border-white/10 bg-space-black/30 px-3 py-2 text-[11px] leading-relaxed text-muted-slate">
                    External geo lookup is unavailable, so this panel falls back to privacy-safe local placeholders.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
