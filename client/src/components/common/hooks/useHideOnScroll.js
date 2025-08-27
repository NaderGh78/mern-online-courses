import { useEffect } from 'react';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const useHideOnScroll = (stateValue, setStateValueOrDispatch, actionToDispatch = null) => {

    useEffect(() => {

        const handleScroll = () => {

            if (stateValue) {

                const scrolled = document.documentElement.scrollTop;

                if (scrolled > 10) {

                    if (actionToDispatch) {

                        // If actionToDispatch is provided, dispatch Redux action
                        setStateValueOrDispatch(actionToDispatch());

                    } else {

                        // If no Redux action, update local state
                        setStateValueOrDispatch(false);

                    }

                }

            }

        };

        if (stateValue) {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, [stateValue, setStateValueOrDispatch, actionToDispatch]);

};

export default useHideOnScroll; 