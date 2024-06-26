---
id: 20230923
title: "Best Practices for Developing Complex Form-Based Apps with React Hook Form and TypeScript Support"
pubDate: 2023-09-26T14:19:07.683Z
author: Oren Farhi
layout: '@/templates/BasePost.astro'
slug: /blog/best_practices_for_developing_complex_form-based_apps_with_react_hook_form_and_typescript_support/
imgSrc: '/images/blog/2023-09/mint-icecream.jpg'
imgAlt: 'mint-icecream'
tags:
  - react
  - react-hook-form
  - architecture
  - clean-code
---

Previously, I delved into the realm of [integrating React Hook Form with Redux], exploring ways to harness the power of these two essential tools for building dynamic forms in React applications. However, my journey didn't end there. In the process of working on that project, I found myself immersed in the intricacies of developing complex form-based applications. This deep dive into form development unveiled a wealth of repeating patterns, invaluable best practices, and insights that significantly influenced my approach to coding, decision-making, and architectural design—especially when tackling large-scale form-based applications.

In this follow-up exploration, I'm excited to share the culmination of my experiences and discoveries. We'll dive into a set of best practices that have proven to be invaluable when dealing with the challenges of developing extensive form-based apps using React Hook Form, and we'll emphasize the added benefits of incorporating TypeScript for enhanced type safety and developer productivity. Whether you're embarking on a new form-based project or looking to optimize an existing one, these practices will undoubtedly pave the way for more efficient development and a smoother user experience. So, let's journey into the world of form-based app development and explore the best practices that can transform your approach and outcomes.

Developing complex form-based applications can be a challenging endeavor, but with the right tools and practices, it becomes much more manageable. [React Hook Form] is a powerful library for managing forms in React applications, and when combined with TypeScript, it offers additional benefits in terms of type safety and developer productivity. In this blog post, we will outline some best practices that can help you harness the full potential of [React Hook Form] while taking advantage of TypeScript for enhanced type checking.

### 1. Break the Form into Small Reusable Components
One of the fundamental principles of React is the concept of componentization. Apply this principle to your forms by breaking them down into small, reusable components. Each component should encapsulate a specific piece of the form's functionality. This approach makes your code more modular and easier to maintain, and when combined with TypeScript, it enables strong type checking for each component.

For example, if you have a complex form with multiple sections, create a separate component for each section. This way, you can define TypeScript interfaces for the props of each component, ensuring type safety throughout your codebase.

```typescript
// Example of a TypeScript interface for a form section component's props
interface SectionProps {
  firstName: string;
  lastName: string;
  // Other form fields...
}

function FormSection({ firstName, lastName }: SectionProps) {
  // Component logic here
}
```

### 2. Standardize Input Interfaces: "value" and "onChange"
To ensure consistency and compatibility, follow the standard input interface of providing "value" and "onChange" handlers for your form inputs. This approach allows [React Hook Form] to seamlessly integrate with your components while providing TypeScript with the necessary information to perform type checking.


```typescript
<input
  type="text"
  name="firstName"
  value={value}
  onChange={onChange}
  // Other input props...
/>
```

By adhering to this interface, you make it easier to connect your form inputs to [React Hook Form], as it relies on these properties to manage form state. TypeScript will also be able to infer types correctly.

### 3. Use the "name" Prop and TypeScript Interfaces
The "name" prop is crucial for [React Hook Form] to interact with your form's context. Each form field should have a unique "name" that corresponds to the field's identity within the form. To leverage TypeScript's type checking capabilities fully, create TypeScript interfaces for your form data and utilize them in your components.

```typescript
// Example of a TypeScript interface for form data
interface FormData {
  firstName: string;
  lastName: string;
  // Other form fields...
}

// In your component
<input
  type="text"
  name="firstName"
  value={formData.firstName}
  onChange={onChange}
  // Other input props...
/>

```

By using TypeScript interfaces to define your form data structure, you gain the benefits of static type checking throughout your application.

## 4. Add Agnostic Props as Needed
In some cases, you may need to add agnostic props to your form inputs. These props can vary depending on the type of input element you're working with. For instance, when dealing with a `<select>` element, you might need to include options. When working with a `<video>` or `<audio>` element, you might need additional attributes. Ensure TypeScript is aware of these props by defining them in your TypeScript interfaces.

```typescript
// Example of a TypeScript interface for a select input
interface MySelectProps {
  options: string[];
  // Other select input props...
  highlight: boolean;
  query: (value: Option) => string;
}

<MySelect name="country" {...props}>
  {options.map((option) => (
    <MyOption key={option} value={option}>
      {option}
    </MyOption>
  ))}
</MySelect>
```

## TypeScript Support for Form Context

To fully leverage TypeScript with [React Hook Form], you can create a typed form context that provides type information for the form's context even when components are nested. Here's an example:

```typescript
import { useFormContext } from 'react-hook-form';

export const useMyFormContext = () => useFormContext<MyFormInterface>();
```

In this example, MyFormInterface is a TypeScript interface that defines the structure of your form data. You can then use this hook within the components you want to interact with this form. These components will be designed to work with the form's interface only, ensuring strong type checking throughout your application.

```typescript
function BookEditor() {
  const { control, regsiter, ...otherFormApiProps } = useBookFormContext();

  // Access and update form state using register and setValue with type safety

  return (
    // JSX for your component
  );
}
```

Another excellent illustration of reusing the form context arises when dealing with a button that necessitates additional actions before saving the form data. This scenario perfectly aligns with the "[ReadM]" book editor form. Within this context, the save button leverages the form context to access the current form data. Subsequently, this data undergoes preprocessing before being dispatched to the backend for further handling.

```typescript
export function SaveBookButton() {
  const formApi = useBookFormContext();
  const draft = formApi.watch();
  const bookId = draft.id;
  const { saveBook, saveStatus } = useSaveBook();

  return (
    <Button
      leftIcon={<AiOutlineCloudUpload size="24" />}
      variant="secondary"
      size="sm"
      isDisabled={!formApi.formState.isDirty}
      onClick={async () => {
        formApi.setValue('fryLevel', getBookLevel(draft));
        formApi.reset({ ...draft, [IMAGES_FOR_DELETION]: [] } as any);
        await saveBook(bookId, draft);
      }}
      isLoading={saveStatus.isLoading}
    >
      Save
    </Button>
  );
}
```

[readm]: https://readm.app
[react hook form]: https://react-hook-form.com/
[integrating React Hook Form with Redux]: https://orizens.com/blog/integrating-react-hook-form-and-redux-toolkit-rtk/
