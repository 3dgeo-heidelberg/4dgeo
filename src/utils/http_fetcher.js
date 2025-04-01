export async function fetchJsonData(url) {
    try {
        const response = await fetch(url, {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }
          });
        if (!response.ok) {
          console.error(`Response status: ${response.status}`);
          return null;
        }
        
        const json = await response.json();
        return json;
      } catch (error) {
        console.error(error.message);
      }

      return null;
}