import { useState } from 'react'
import type { EligibilityResult, Profile, Scholarship } from '../data/scholarships'
import { ASSISTANT_SUGGESTIONS, answerAssistant } from '../lib/assistant'
import type { AssistantAnswer } from '../lib/assistant'
import { daysLeft, formatDate } from '../data/scholarships'

interface AssistantViewProps {
  profile: Profile
  results: EligibilityResult[]
  onSelect: (scholarship: Scholarship) => void
}

export default function AssistantView({ profile, results, onSelect }: AssistantViewProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<AssistantAnswer | null>(null)

  function ask(value: string) {
    if (!value.trim()) return
    setQuestion(value)
    setAnswer(answerAssistant(value, profile, results))
  }

  return (
    <main id="main-content">
      <h1>Scholarship assistant</h1>
      <p className="intro">Ask about the 14 scholarships in this app. The assistant is rule-based: it answers only from the scholarship list and your eligibility results, not a live AI model.</p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault()
          ask(question)
        }}
      >
        <label htmlFor="assistant-question">Your question
          <input
            id="assistant-question"
            type="text"
            autoComplete="off"
            placeholder="For example, what is closing soonest?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>
        <div className="actions">
          <button className="btn primary" type="submit">Ask</button>
        </div>
      </form>
      <div className="chip-row" aria-label="Suggested questions">
        {ASSISTANT_SUGGESTIONS.map((s) => (
          <button className="btn chip" type="button" key={s} onClick={() => ask(s)}>{s}</button>
        ))}
      </div>
      {answer && (
        <section className="answer" aria-live="polite">
          <h2>{answer.title}</h2>
          <p>{answer.text}</p>
          {answer.scholarships.length > 0 && (
            <div className="grid">
              {answer.scholarships.map((s) => (
                <article className="card" key={s.id}>
                  <p className="provider">{s.provider}</p>
                  <h3>{s.name}</h3>
                  <p className="amount">{s.amountText}</p>
                  <p className="deadline">{daysLeft(s.deadline)} days left, deadline {formatDate(s.deadline)}</p>
                  <div className="actions">
                    <button className="btn primary" type="button" onClick={() => onSelect(s)}>View details</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}
