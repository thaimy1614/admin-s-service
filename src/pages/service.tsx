import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ServiceView } from 'src/sections/service/view';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <ServiceView />
    </>
  );
}
