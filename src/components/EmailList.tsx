import { FC } from 'react'
import { MdLabel, MdInbox, MdWarning, MdMarkEmailRead } from 'react-icons/md'
import { BiLoaderAlt } from 'react-icons/bi'

interface Email {
  id: string;
  subject: string;
  snippet: string;
  category?: string;
}

interface EmailListProps {
  emails: Email[];
  isLoading?: boolean;
}

const EmailList: FC<EmailListProps> = ({ emails, isLoading }) => {
  const getCategoryConfig = (category: string | undefined) => {
    switch (category?.toLowerCase()) {
      case 'important':
        return {
          icon: <MdMarkEmailRead />,
          classes: 'bg-green-500/10 text-green-500 border-green-500/20',
        };
      case 'marketing':
        return {
          icon: <MdLabel />,
          classes: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        };
      case 'spam':
        return {
          icon: <MdWarning />,
          classes: 'bg-red-500/10 text-red-500 border-red-500/20',
        };
      default:
        return {
          icon: <MdInbox />,
          classes: 'bg-gray-500/10 text-gray-400 border-gray-600/20',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-800/50 p-6 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <BiLoaderAlt className="animate-spin text-gray-600 ml-auto" />
            </div>
            <div className="space-y-3 mt-4">
              <div className="h-3 bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700 mt-4">
        <MdInbox className="text-6xl text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No emails to display. Click "Fetch Emails" to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 mt-4">
      {emails.map(email => {
        const categoryConfig = getCategoryConfig(email.category);
        return (
          <div 
            key={email.id} 
            className="group bg-gray-800/50 hover:bg-gray-800/70 p-6 rounded-xl border border-gray-700/50 transition-all duration-200 backdrop-blur-sm hover:border-gray-600"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-xl mb-2 text-gray-100 flex-1">{email.subject}</h3>
              {email.category && (
                <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${categoryConfig.classes} ml-4`}>
                  {categoryConfig.icon}
                  {email.category}
                </span>
              )}
            </div>
            <p className="text-gray-400 mb-3 line-clamp-2 leading-relaxed">{email.snippet}</p>
          </div>
        );
      })}
    </div>
  );
}

export default EmailList;
