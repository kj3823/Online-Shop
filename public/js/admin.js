//Client-Side JS
const deleteProduct = (button) => {
    // console.log("Clicked")
    // console.log(button.parentNode);
    // console.log(button.parentNode.querySelector('[name=productID]').value);
    //parent class is the div, inside the div we have our values.
    const productID = button.parentNode.querySelector('[name=productID]').value;
    const csrfToken = button.parentNode.querySelector('[name=_csrf]').value;

    const productElement = button.closest('article') // finds the article corresponding to the button clicked.
    fetch('/admin/product/' + productID, {
            method: 'DELETE',
            headers: {
                'csrf-Token': csrfToken
            }
        })
        .then(result => {
            return result.json() //throws a new promise.
        })
        .then(data => {
            console.log(data);
            productElement.parentNode.removeChild(productElement); //deletes that element from the page.
        })
        .catch(err => console.log(err));
}