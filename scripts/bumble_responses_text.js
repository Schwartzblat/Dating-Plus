let current_match_index = 0;

const bumble_init_response_hook = () => {
    const matches_handler = (data) => {
        current_matches = data.body[0].client_encounters.results;
        console.log(current_matches);
        return data;
    };


    const match_handler = () => {
        const match = current_matches[current_match_index];
        if (!match?.user?.their_vote || match.user.their_vote === 1) {
            console.log(`${match.user.name} haven't voted yet`);
            return;
        }
        const is_match = match.user.their_vote === 2;

        try {
            const v_icon = document.getElementsByClassName('encounters-action tooltip-activator encounters-action--like')[0];
            v_icon.childNodes[0].childNodes[0].childNodes[0].childNodes[0].setAttribute('fill', is_match ? 'green' : 'red')
        } catch (e) {
            console.log(e);
        }
    };

    const parse_clone = JSON.parse;

    JSON.parse = function (string) {
        if (string.includes('badoo.bma.ClientVoteResponse')) {
            current_match_index++;
            console.log(`current_match_index: ${current_match_index}`);
            match_handler();
        }
        let ret = parse_clone(string);

        if (ret?.body?.[0]?.client_encounters?.results) {
            current_match_index = 0
            ret = matches_handler(ret);
            match_handler();
            return ret;
        }
        return ret;
    };
}
