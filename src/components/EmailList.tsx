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
          icon: <MdMarkEmailRead className="text-lg" />,
          classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        };
      case 'marketing':
        return {
          icon: <MdLabel className="text-lg" />,
          classes: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        };
      case 'spam':
        return {
          icon: <MdWarning className="text-lg" />,
          classes: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        };
      default:
        return {
          icon: <MdInbox className="text-lg" />,
          classes: 'bg-gray-500/20 text-gray-400 border-gray-600/30',
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
        <p className="text-gray-400 text-lg">No emails to display. Click &quot;Fetch Emails&quot; to get started.</p>
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
            {email.category && (
              <div className="mb-3">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${categoryConfig.classes}`}>
                  {categoryConfig.icon}
                  {email.category}
                </span>
              </div>
            )}
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-gray-100">{email.subject}</h3>
              <p className="text-gray-400 line-clamp-2 leading-relaxed">{email.snippet}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default EmailList;
