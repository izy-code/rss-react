# React Routing. Tests.

## Technical Requirements

1. Create a separate branch for this task from the previous task's branch. Branch name: "hooks-and-routing".
2. All components must be changed to **functional components**, except **Error Boundary** components, as error boundaries in React still need to be class components.
   - Implement custom hook to restore search query from the local storage (LS) and put it to the LS on unmount. Use respective React lifecycle hook as a basis.
3. All logic should be split into components:
   - If you need an access either to the component's lifecycle or the state **use hooks**.
   - All data should be stored in the **component's state**.
4. Add routing to your application using **React Router**.
5. Add a 404 page when user navigates to non-existing route.
6. Add and configure a test runner: Jest or Vitest. Test runner should show the test coverage. You should aim to reach at least 80% of the test coverage.
7. Add a testing library: React Testing Library. You should add tests for the several scenarios keeping in mind that mocked data should be used instead of real API calls.
8. Tests for the Card List component:
   - Verify that the component renders the specified number of cards;
   - Check that an appropriate message is displayed if no cards are present.
9. Tests for the Card component:
   - Ensure that the card component renders the relevant card data;
   - Validate that clicking on a card opens a detailed card component;
   - Check that clicking triggers an additional API call to fetch detailed information.
10. Tests for the Detailed Card component:

- Check that a loading indicator is displayed while fetching data;
- Make sure the detailed card component correctly displays the detailed card data;
- Ensure that clicking the close button hides the component.

11. Tests for the Pagination component:

- Make sure the component updates URL query parameter when page changes.

12. Tests for the Search component:

- Verify that clicking the Search button saves the entered value to the local storage;
- Check that the component retrieves the value from the local storage upon mounting.

13. Lastly, update Husky to run tests on the pre-push hook, ensuring that tests are automatically executed before any code is pushed.

## Application Requirements

1. Add pagination:
   - implement pagination for your existing item list
   - display the current page in the browser URL using query parameters (e.g. ?page=2, e.g /search/2).
   - the pagination component should appear after receiving the list of all items.
2. Main page displays search results. On item click page should be split into 2 section:
   - left section will continue to display search results;
   - right section should display details using Router Outlet (show loading indicator while making an additional call for details, add control for closing the section, also section should be closed when user clicks on the left section)
   - reflect in the url that "Details" section has been opened for the selected item (e.g. /?frontpage=2&details=1).

## Points

A student can achieve a maximum of 100 points.

### Cross-check (score can be less if some parts of the functionality don't work)

- Tests are added to the project, can be run via a `test` command in the package.json, no errors are produced, test coverage >= 80% (at least for `statements`) - **30**
- Conversion of class components to functional components with hooks - **15**
- Custom hook to restore search query from LS and put it back to LS on unmount - **5**
- Pagination is present in both URL and on the page - **20**
- Upon clicking, open details panel on the right side of the page: - **5**
  - use router outlet, left side of the page should continue displaying the list of results - **10**
  - initiate an additional API call, display a loader, and update the URL - **5**
  - Details panel should be closed either on the "close" button click or on the main panel click - **10**

### Penalties

- TypeScript isn't used: **-95 points**
- Usage of _any_: **-20 points per each**
- Usage of _ts-ignore_: **-20 points per each**
- Direct DOM manipulations inside the React components: **-50 points per each**
- Presence of _code-smells_ (God-object, chunks of duplicate code), commented code sections: **-10 points per each**
- Usage of Redux or other state management libraries: **-100 points**
- Usage of component libraries, e.g. Material UI, Ant Design: **-100 points**
- Commits after the deadline: **-40 points**
- Pull Request doesn't follow guideline (including checkboxes in Score) [PR example](https://docs.rs.school/#/en/pull-request-review-process?id=pull-request-description-must-contain-the-following): **-10 points**
