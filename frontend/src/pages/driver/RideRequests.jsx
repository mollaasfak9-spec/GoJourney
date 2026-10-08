import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import RequestCard from '../../components/driver/RequestCard'
import { DRIVER_REQUESTS } from '../../constants/mockData'

export default function RideRequests() {
  const { online } = useOutletContext()
  const navigate = useNavigate()
  const [requests, setRequests] = useState(DRIVER_REQUESTS)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Ride requests"
        description={online ? 'Accept a request to start navigating.' : 'Go online to see new requests.'}
      />

      <div className="mt-6 space-y-4">
        {!online || requests.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title={online ? 'No requests right now' : "You're offline"}
            description={
              online
                ? "Stay online and they'll appear here."
                : 'Switch to online from the top bar to start receiving requests.'
            }
          />
        ) : (
          requests.map((request, index) => (
            <RequestCard
              key={request.id}
              request={request}
              index={index}
              onAccept={(item) => navigate(`/driver/rides/${item.id}`)}
              onReject={(item) => setRequests((prev) => prev.filter((entry) => entry.id !== item.id))}
            />
          ))
        )}
      </div>
    </div>
  )
}
