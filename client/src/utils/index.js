import toast from 'react-hot-toast';

export const getInitials = (fullname) => {
  return fullname
    .split(' ')
    .slice(0, 2)
    .map((name) => name[0])
    .join('')
    .toUpperCase();
};

export const formatDate = (date) => {
  // Get the month, day, and year
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};

export const dateFormatter = (dateString) => {
  const inputDate = new Date(dateString);

  if (isNaN(inputDate)) {
    return 'Invalid Date';
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const day = String(inputDate.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export const PRIOTITYSTYELS = {
  high: 'text-red-600',
  medium: 'text-yellow-600',
  normal: 'text-green-600',
};

export const TASK_TYPE = {
  todo: 'bg-blue-600',
  'in progress': 'bg-yellow-600',
  completed: 'bg-green-600',
};

export const BGS = ['bg-green-600', 'bg-yellow-600', 'bg-blue-600', 'bg-green-600'];
export const Border = ['border-t-green-600', 'border-t-yellow-600', 'border-t-blue-600', 'border-t-green-600'];

export const act_types = ['Assigned', 'Started', 'In Progress', 'Commented', 'Bug', 'Completed'];
export const LISTS = ['TODO', 'IN PROGRESS', 'COMPLETED'];
export const PRIORITY = ['HIGH', 'MEDIUM', 'NORMAL'];
export const loadingDatab = async (data, success, error, durationSuccess) => {
  toast.promise(
    data,
    {
      loading: 'Sedang Memproses...',
      success: () => success ?? `Successfully`,
      error: () => error ?? `Failed`,
    },
    {
      style: {
        minWidth: '250px',
      },
      success: {
        duration: durationSuccess ?? 5000,
        icon: '🔥',
      },
    }
  );
};
