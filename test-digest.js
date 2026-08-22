const { DynamicServerError } = require('next/dist/client/components/hooks-server-context');
const error = new DynamicServerError('unstable_noStore()');
console.log(error.digest);
