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
  const getCategoryClass = (category: string | undefined) => {
    switch (category) {
      case 'Important':
        return 'text-green-500';
      case 'Marketing':
        return 'text-yellow-500';
      case 'Spam':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <ul className="email-list w-full">
      {emails.map(email => (
        <li key={email.id} className="email-item bg-gray-800 p-4 mb-4 rounded-md shadow-md">
          <h3 className="font-bold text-xl mb-2">{email.subject}</h3>
          <p className="mb-2">{email.snippet}</p>
          {email.category && (
            <p className={`italic text-sm ${getCategoryClass(email.category)}`}>
              {email.category}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

export default EmailList;
