const {init_delay} = require('./init')
const {init_mysql} = require('./mount_mysql')

let init = null;
    /**
 * Initialize vault service
 */
init_delay(10000)
    .catch(console.error)


// /**
//  * Setup mysql database as vault backend storage engine
//  */
// init_mysql()
//     .catch(console.error)


