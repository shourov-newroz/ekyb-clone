import BACKEND_ENDPOINTS from '@/api/urls';
import { Card } from '@/components/HOC/Card';
import LoadingSvg from '@/components/loading/LoadingSvg';
import IssuesForm from '@/components/pages/dashboard/issues/IssuesForm';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IApiResponse, ICompanyData } from '@/types/common';
import { IIssueResponse } from '@/types/issues';
import { useSearchParams } from 'react-router-dom';
import useSWR from 'swr';

interface IssuesProps {
  companyData?: ICompanyData;
}

const Issues: React.FC<IssuesProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabQuery = searchParams.get('active') || 'pending';

  const handleMenuChange = (menu: string) => {
    setSearchParams({ active: menu });
  };

  const { data, isLoading, mutate, isValidating } = useSWR<
    IApiResponse<IIssueResponse>
  >(BACKEND_ENDPOINTS.GET_ISSUES);

  const handleSuccessfulSubmission = () => {
    handleMenuChange('history');
    mutate();
  };

  const pendingIssues =
    data?.data?.issues.applicationTracking.filter(
      (issue) => issue.status === 'CLARIFICATION'
    ) || [];

  const historyIssues =
    data?.data?.issues.applicationTracking.filter(
      (issue) => issue.status !== 'CLARIFICATION'
    ) || [];

  return (
    <section className='container mx-auto flex flex-1 flex-col px-4 md:flex-row'>
      <main className='my-[30px] w-full'>
        <div>
          <h1 className='mb-6 mt-3 text-pretty font-bukra-semibold text-3xl font-semibold'>
            Additional Information Is Required
          </h1>
          <p className='mb-8 text-pretty text-base'>
            Please reply promptly with the requested details for below request.
            This will help us to process your application faster.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            className={cn(
              'rounded-lg px-8',
              activeTabQuery === 'pending' &&
                'bg-primary hover:bg-primary text-white hover:text-white'
            )}
            onClick={() => handleMenuChange('pending')}
          >
            Pending Request
          </Button>
          <Button
            variant='outline'
            className={cn(
              'rounded-lg px-8',
              activeTabQuery === 'history' &&
                'bg-primary hover:bg-primary text-white hover:text-white'
            )}
            onClick={() => handleMenuChange('history')}
          >
            Submitted Request
          </Button>
        </div>

        <Card className='mt-6 overflow-hidden rounded-md'>
          {isLoading || isValidating ? (
            <div className='flex min-h-[200px] items-center justify-center'>
              <LoadingSvg className='size-12' />
            </div>
          ) : (
            <>
              {activeTabQuery === 'pending' && (
                <IssuesForm
                  issues={pendingIssues}
                  isHistory={false}
                  handleSuccessfulSubmission={handleSuccessfulSubmission}
                />
              )}
              {activeTabQuery === 'history' && (
                <IssuesForm
                  issues={historyIssues}
                  isHistory={true}
                  handleSuccessfulSubmission={handleSuccessfulSubmission}
                />
              )}
            </>
          )}
        </Card>
      </main>
    </section>
  );
};

export default Issues;
