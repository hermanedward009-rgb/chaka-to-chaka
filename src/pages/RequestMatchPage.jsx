import PageHeader from '../components/PageHeader.jsx'
import RequestMatchForm from '../components/RequestMatchForm.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function RequestMatchPage() {
  usePageTitle('Request a Match')

  return (
    <div className="pb-16">
      <PageHeader eyebrow="Fixtures" title="Request a match">
        <p>
          Send a fixture request to Chaka to Chaka. Fill in the details, then press Send in WhatsApp or your email app so the club receives it.
        </p>
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="rounded-[2rem] border border-line bg-card p-6">
          <h2 className="font-display text-4xl uppercase">How sending works</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-muted">
            <li>Fill in the team, contact, date, and venue.</li>
            <li>Choose WhatsApp or email. Required fields are checked first.</li>
            <li>Your device opens the message with a reference number.</li>
            <li>Press Send in WhatsApp or your email app. Until then, the club has not received it.</li>
          </ol>
        </aside>
        <RequestMatchForm />
      </div>
    </div>
  )
}
