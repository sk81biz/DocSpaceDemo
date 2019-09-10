# Toast

## Usage

```js
import { Toast, toastr } from 'asc-web-components';
import 'react-toastify/dist/ReactToastify.min.css'; // You can place it here, but recommended place this file in main file, which contains all css`s
```

#### Description

Toast allow you to add notification to your page with ease.
`<Toast />` is container for your notification. Remember to render the `<Toast />` *once* in your application tree. If you can't figure out where to put it, rendering it in the application root would be the best bet.
`toastr` is a function for showing notifications.

#### Usage

```js
<Toast />
<button onClick={() => toastr.success('Some text for toast', 'Some text for title', true)}>Click</button>
```

or 

```js
<Toast>
  {toastr.success('Some text for toast')}
</Toast>
```
You can use simple html tags. For this action you should wrap your message by empty tags:
```js

<Toast />
<button onClick={() => toastr.success(<>You have <b>bold text</b></>)}>Click</button>
```

If your notification include only text in html tags or data in JSX tags, you can omit empty tags:
```js

<Toast />
<button onClick={() => toastr.success(<b>Bold text</b>)}>Click</button>
```

```js
import { Text } from 'asc-web-components';

<Toast />
<button onClick={() => toastr.success(<Text.Body>The email activation instructions have been sent to the <b>{user.email}</b> email address</Text.Body>))}>Click</button>
```

#### Properties

| Props              | Type     | Required | Values                      | Default        | Description                                                       |
| ------------------ | -------- | :------: | --------------------------- | -------------- | ----------------------------------------------------------------- |
| `type`             | `oneOf`  |    ✅    | success, error, warning, info | -     | Define color and icon of toast                                           |
| `data`             | `JSX` or `string` |    -     | -                             | -     | Any components or data inside a toast                                                      |
| `title`            | `string` |    -     | -                             | -     | Title inside a toast                                                     |
| `withCross`       | `bool`   |    -     | true, false                   | `false`|If `false`: toast disappeared after clicking on any area of toast. If `true`:  toast disappeared after clicking on  close button|
| `timeout`       | `number`   |    -     | from 750ms, `0` for disabling                   | `5000`|Time (in milliseconds) for showing your toast. Setting in `0` let you to show toast constantly until clicking on it|

#### Other Options
```js
<Toast/>
    // Remove all toasts in your page programmatically
    <button onClick = {()=> { toastr.clear() }}>Clear</button>
```

#### Examples
```js
<Toast>
    // Display a warning toast, with no title
    {toastr.warning('My name is Dan. I like my cat')}

    // Display a success toast, with a title
    {toastr.success('Have fun storming the castle!', 'Miracle Max Says')}

    // Display a error toast, with title and you should close it manually
    {toastr.error('I do not think that word means what you think it means.', 'Inconceivable!', false)}
</Toast>
```