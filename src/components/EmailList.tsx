import { FC } from 'react'

interface Email {
  id: string;
  subject: string;
  snippet: string;
  category?: string;
}

interface EmailListProps {
  emails: Email[];
}

const EmailList: FC<EmailListProps> = ({ emails }) => {
  return (
    <ul className="email-list">
      {emails.map(email => (
        <li key={email.id} className="email-item border-b p-2">
          <h3 className="font-bold">{email.subject}</h3>
          <p>{email.snippet}</p>
          {email.category && <p className="italic text-sm">Category: {email.category}</p>}
        </li>
      ))}
    </ul>
  )
}

export default EmailList
