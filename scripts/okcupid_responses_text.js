let current_matches = [];


const okcupid_init_response_hook = () => {

    setInterval(() => {
        const elements = document.getElementsByClassName('usercard-placeholder-thumb');
        for (const element of elements) {
            element.className = 'usercard-placeholder';
        }
        for (const paywall of document.getElementsByClassName('likes-you-paywall-explainer-cta')) {
            paywall.remove();
        }
    }, 100);

    const matches_handler = (data) => {
        current_matches = data.data.me.matches;
        return JSON.stringify(data);
    };


    const match_handler = (user_id) => {
        const match = current_matches.some(match => match.user.id === user_id);
        if (!match?.targetVote || match.targetVote === 'NONE') {
            console.log(`${user_id} haven't voted yet`);
            return;
        }
        const like_and_pass_buttons = document.getElementsByClassName('dt-action-buttons-button-text');
        const like_button = like_and_pass_buttons[1];
        like_button.textContent = match.targetVote === 'LIKE' ? 'MATCH' : 'NOPE';
    };

    const who_liked_you_handler = (data) => {
        data.data.me.likes.data.map((like) => {
            like.primaryImageBlurred = like.primaryImage;
        });
        return JSON.stringify(data);
    };

    const text_clone = Response.prototype.text;

    Response.prototype.text = async function () {
        const text = await text_clone.call(this);
        if (!this.url.includes('graphql')) {
            return text;
        }
        const data = JSON.parse(text);
        if (data?.data?.me?.matches) {
            return matches_handler(data);
        }
        if (data?.data?.me?.match?.user?.id) {
            match_handler(data.data.me.match.user.id);
        }
        if (data?.data?.me?.likes) {
            return who_liked_you_handler(data);
        }
        return JSON.stringify(data);
    };
}
