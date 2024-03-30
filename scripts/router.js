const start = async () => {
    const url = new URL(location.href);
    if (url.host.includes('okcupid.com')) {
        okcupid_init_response_hook();
    } else if (url.host.includes('bumble.com')) {
        bumble_init_response_hook();
    }
};

console.log('Dating-Plus loaded successfully!');
start();
