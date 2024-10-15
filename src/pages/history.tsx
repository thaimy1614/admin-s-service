import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { HistoryView } from 'src/sections/history/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <HistoryView />
    </>
  );
}
