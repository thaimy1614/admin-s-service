import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { CategoryView } from 'src/sections/category/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <CategoryView />
    </>
  );
}
