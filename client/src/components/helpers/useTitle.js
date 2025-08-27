import { useEffect } from 'react';

/*===========================================*/
/*===========================================*/
/*===========================================*/

//make the Title Pages daynamic
export const useTitle = (title) => {

    useEffect(() => {

        document.title = `${title}`

    }, [title]);

    return null;

} 