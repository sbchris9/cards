import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Board = {
   __typename?: 'Board';
  id: Scalars['ID'];
  position: Scalars['Int'];
  name: Scalars['String'];
  user: User;
  rows: Array<Row>;
};

export type BoardInput = {
  name: Scalars['String'];
  position?: Maybe<Scalars['Int']>;
};

export type Card = {
   __typename?: 'Card';
  id: Scalars['ID'];
  position: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  row: Row;
};

export type CardInput = {
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  rowId?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
};

export type LoginResponse = {
   __typename?: 'LoginResponse';
  user?: Maybe<User>;
  accessToken: Scalars['String'];
};

export type Mutation = {
   __typename?: 'Mutation';
  createBoard: Board;
  updateBoard: Board;
  removeBoard: Board;
  createCard: Card;
  updateCard: Card;
  removeCard: Card;
  createRow: Row;
  updateRow: Row;
  removeRow: Row;
  register: Scalars['Boolean'];
  login: LoginResponse;
  logout: Scalars['Boolean'];
  deleteAccount: Scalars['Boolean'];
  revokeRefreshTokensForUser: Scalars['Boolean'];
};


export type MutationCreateBoardArgs = {
  boardData: BoardInput;
};


export type MutationUpdateBoardArgs = {
  boardData: BoardInput;
  id: Scalars['ID'];
};


export type MutationRemoveBoardArgs = {
  id: Scalars['ID'];
};


export type MutationCreateCardArgs = {
  cardData: CardInput;
  rowId: Scalars['ID'];
};


export type MutationUpdateCardArgs = {
  cardData: CardInput;
  id: Scalars['ID'];
};


export type MutationRemoveCardArgs = {
  id: Scalars['ID'];
};


export type MutationCreateRowArgs = {
  position: Scalars['Int'];
  boardId: Scalars['String'];
};


export type MutationUpdateRowArgs = {
  rowData: RowInput;
  id: Scalars['ID'];
};


export type MutationRemoveRowArgs = {
  id: Scalars['ID'];
};


export type MutationRegisterArgs = {
  terms: Scalars['Boolean'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRevokeRefreshTokensForUserArgs = {
  userId: Scalars['Int'];
};

export type Query = {
   __typename?: 'Query';
  myBoards: Array<Board>;
  getBoard?: Maybe<Board>;
  fail: Scalars['Boolean'];
  hello: Scalars['String'];
  me: User;
};


export type QueryGetBoardArgs = {
  id: Scalars['String'];
};

export type Row = {
   __typename?: 'Row';
  id: Scalars['ID'];
  position: Scalars['Int'];
  color?: Maybe<Scalars['String']>;
  board: Board;
  cards: Array<Card>;
};

export type RowInput = {
  color?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
};

export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  boards: Array<Board>;
};

export type CreateCardMutationVariables = {
  rowId: Scalars['ID'];
  cardData: CardInput;
};


export type CreateCardMutation = (
  { __typename?: 'Mutation' }
  & { createCard: (
    { __typename?: 'Card' }
    & Pick<Card, 'id' | 'title' | 'position'>
    & { row: (
      { __typename?: 'Row' }
      & Pick<Row, 'id'>
    ) }
  ) }
);

export type CreateRowMutationVariables = {
  boardID: Scalars['String'];
  position: Scalars['Int'];
};


export type CreateRowMutation = (
  { __typename?: 'Mutation' }
  & { createRow: (
    { __typename?: 'Row' }
    & Pick<Row, 'id' | 'position'>
  ) }
);

export type DeleteAccountMutationVariables = {};


export type DeleteAccountMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteAccount'>
);

export type HelloQueryVariables = {};


export type HelloQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'hello'>
);

export type LoginMutationVariables = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
  ) }
);

export type LogoutMutationVariables = {};


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type MeQueryVariables = {};


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type MyBoardsQueryVariables = {};


export type MyBoardsQuery = (
  { __typename?: 'Query' }
  & { myBoards: Array<(
    { __typename?: 'Board' }
    & Pick<Board, 'id' | 'name'>
    & { rows: Array<(
      { __typename?: 'Row' }
      & Pick<Row, 'id'>
      & { cards: Array<(
        { __typename?: 'Card' }
        & Pick<Card, 'id' | 'title' | 'content'>
      )> }
    )> }
  )> }
);

export type RegisterMutationVariables = {
  username: Scalars['String'];
  password: Scalars['String'];
  terms: Scalars['Boolean'];
};


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'register'>
);

export type RemoveCardMutationVariables = {
  id: Scalars['ID'];
};


export type RemoveCardMutation = (
  { __typename?: 'Mutation' }
  & { removeCard: (
    { __typename?: 'Card' }
    & Pick<Card, 'id'>
    & { row: (
      { __typename?: 'Row' }
      & Pick<Row, 'id'>
    ) }
  ) }
);

export type RemoveRowMutationVariables = {
  id: Scalars['ID'];
};


export type RemoveRowMutation = (
  { __typename?: 'Mutation' }
  & { removeRow: (
    { __typename?: 'Row' }
    & Pick<Row, 'id'>
  ) }
);

export type UpdateCardMutationVariables = {
  id: Scalars['ID'];
  cardData: CardInput;
};


export type UpdateCardMutation = (
  { __typename?: 'Mutation' }
  & { updateCard: (
    { __typename?: 'Card' }
    & Pick<Card, 'id' | 'position' | 'content' | 'title'>
    & { row: (
      { __typename?: 'Row' }
      & Pick<Row, 'id'>
    ) }
  ) }
);

export type UpdateRowMutationVariables = {
  id: Scalars['ID'];
  position?: Maybe<Scalars['Int']>;
};


export type UpdateRowMutation = (
  { __typename?: 'Mutation' }
  & { updateRow: (
    { __typename?: 'Row' }
    & Pick<Row, 'id' | 'position'>
  ) }
);


export const CreateCardDocument = gql`
    mutation CreateCard($rowId: ID!, $cardData: CardInput!) {
  createCard(rowId: $rowId, cardData: $cardData) {
    id
    title
    position
    row {
      id
    }
  }
}
    `;
export type CreateCardMutationFn = ApolloReactCommon.MutationFunction<CreateCardMutation, CreateCardMutationVariables>;

/**
 * __useCreateCardMutation__
 *
 * To run a mutation, you first call `useCreateCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCardMutation, { data, loading, error }] = useCreateCardMutation({
 *   variables: {
 *      rowId: // value for 'rowId'
 *      cardData: // value for 'cardData'
 *   },
 * });
 */
export function useCreateCardMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCardMutation, CreateCardMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateCardMutation, CreateCardMutationVariables>(CreateCardDocument, baseOptions);
      }
export type CreateCardMutationHookResult = ReturnType<typeof useCreateCardMutation>;
export type CreateCardMutationResult = ApolloReactCommon.MutationResult<CreateCardMutation>;
export type CreateCardMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCardMutation, CreateCardMutationVariables>;
export const CreateRowDocument = gql`
    mutation CreateRow($boardID: String!, $position: Int!) {
  createRow(boardId: $boardID, position: $position) {
    id
    position
  }
}
    `;
export type CreateRowMutationFn = ApolloReactCommon.MutationFunction<CreateRowMutation, CreateRowMutationVariables>;

/**
 * __useCreateRowMutation__
 *
 * To run a mutation, you first call `useCreateRowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRowMutation, { data, loading, error }] = useCreateRowMutation({
 *   variables: {
 *      boardID: // value for 'boardID'
 *      position: // value for 'position'
 *   },
 * });
 */
export function useCreateRowMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRowMutation, CreateRowMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateRowMutation, CreateRowMutationVariables>(CreateRowDocument, baseOptions);
      }
export type CreateRowMutationHookResult = ReturnType<typeof useCreateRowMutation>;
export type CreateRowMutationResult = ApolloReactCommon.MutationResult<CreateRowMutation>;
export type CreateRowMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRowMutation, CreateRowMutationVariables>;
export const DeleteAccountDocument = gql`
    mutation DeleteAccount {
  deleteAccount
}
    `;
export type DeleteAccountMutationFn = ApolloReactCommon.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteAccountMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, baseOptions);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = ApolloReactCommon.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const HelloDocument = gql`
    query Hello {
  hello
}
    `;

/**
 * __useHelloQuery__
 *
 * To run a query within a React component, call `useHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useHelloQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<HelloQuery, HelloQueryVariables>) {
        return ApolloReactHooks.useQuery<HelloQuery, HelloQueryVariables>(HelloDocument, baseOptions);
      }
export function useHelloLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<HelloQuery, HelloQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<HelloQuery, HelloQueryVariables>(HelloDocument, baseOptions);
        }
export type HelloQueryHookResult = ReturnType<typeof useHelloQuery>;
export type HelloLazyQueryHookResult = ReturnType<typeof useHelloLazyQuery>;
export type HelloQueryResult = ApolloReactCommon.QueryResult<HelloQuery, HelloQueryVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    accessToken
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
export const MyBoardsDocument = gql`
    query MyBoards {
  myBoards {
    id
    name
    rows {
      id
      cards {
        id
        title
        content
      }
    }
  }
}
    `;

/**
 * __useMyBoardsQuery__
 *
 * To run a query within a React component, call `useMyBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyBoardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyBoardsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MyBoardsQuery, MyBoardsQueryVariables>) {
        return ApolloReactHooks.useQuery<MyBoardsQuery, MyBoardsQueryVariables>(MyBoardsDocument, baseOptions);
      }
export function useMyBoardsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyBoardsQuery, MyBoardsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MyBoardsQuery, MyBoardsQueryVariables>(MyBoardsDocument, baseOptions);
        }
export type MyBoardsQueryHookResult = ReturnType<typeof useMyBoardsQuery>;
export type MyBoardsLazyQueryHookResult = ReturnType<typeof useMyBoardsLazyQuery>;
export type MyBoardsQueryResult = ApolloReactCommon.QueryResult<MyBoardsQuery, MyBoardsQueryVariables>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!, $terms: Boolean!) {
  register(username: $username, password: $password, terms: $terms)
}
    `;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *      terms: // value for 'terms'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const RemoveCardDocument = gql`
    mutation RemoveCard($id: ID!) {
  removeCard(id: $id) {
    id
    row {
      id
    }
  }
}
    `;
export type RemoveCardMutationFn = ApolloReactCommon.MutationFunction<RemoveCardMutation, RemoveCardMutationVariables>;

/**
 * __useRemoveCardMutation__
 *
 * To run a mutation, you first call `useRemoveCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCardMutation, { data, loading, error }] = useRemoveCardMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveCardMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveCardMutation, RemoveCardMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveCardMutation, RemoveCardMutationVariables>(RemoveCardDocument, baseOptions);
      }
export type RemoveCardMutationHookResult = ReturnType<typeof useRemoveCardMutation>;
export type RemoveCardMutationResult = ApolloReactCommon.MutationResult<RemoveCardMutation>;
export type RemoveCardMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveCardMutation, RemoveCardMutationVariables>;
export const RemoveRowDocument = gql`
    mutation RemoveRow($id: ID!) {
  removeRow(id: $id) {
    id
  }
}
    `;
export type RemoveRowMutationFn = ApolloReactCommon.MutationFunction<RemoveRowMutation, RemoveRowMutationVariables>;

/**
 * __useRemoveRowMutation__
 *
 * To run a mutation, you first call `useRemoveRowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveRowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeRowMutation, { data, loading, error }] = useRemoveRowMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveRowMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveRowMutation, RemoveRowMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveRowMutation, RemoveRowMutationVariables>(RemoveRowDocument, baseOptions);
      }
export type RemoveRowMutationHookResult = ReturnType<typeof useRemoveRowMutation>;
export type RemoveRowMutationResult = ApolloReactCommon.MutationResult<RemoveRowMutation>;
export type RemoveRowMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveRowMutation, RemoveRowMutationVariables>;
export const UpdateCardDocument = gql`
    mutation UpdateCard($id: ID!, $cardData: CardInput!) {
  updateCard(id: $id, cardData: $cardData) {
    id
    position
    content
    title
    row {
      id
    }
  }
}
    `;
export type UpdateCardMutationFn = ApolloReactCommon.MutationFunction<UpdateCardMutation, UpdateCardMutationVariables>;

/**
 * __useUpdateCardMutation__
 *
 * To run a mutation, you first call `useUpdateCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCardMutation, { data, loading, error }] = useUpdateCardMutation({
 *   variables: {
 *      id: // value for 'id'
 *      cardData: // value for 'cardData'
 *   },
 * });
 */
export function useUpdateCardMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateCardMutation, UpdateCardMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateCardMutation, UpdateCardMutationVariables>(UpdateCardDocument, baseOptions);
      }
export type UpdateCardMutationHookResult = ReturnType<typeof useUpdateCardMutation>;
export type UpdateCardMutationResult = ApolloReactCommon.MutationResult<UpdateCardMutation>;
export type UpdateCardMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateCardMutation, UpdateCardMutationVariables>;
export const UpdateRowDocument = gql`
    mutation UpdateRow($id: ID!, $position: Int) {
  updateRow(id: $id, rowData: {position: $position}) {
    id
    position
  }
}
    `;
export type UpdateRowMutationFn = ApolloReactCommon.MutationFunction<UpdateRowMutation, UpdateRowMutationVariables>;

/**
 * __useUpdateRowMutation__
 *
 * To run a mutation, you first call `useUpdateRowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRowMutation, { data, loading, error }] = useUpdateRowMutation({
 *   variables: {
 *      id: // value for 'id'
 *      position: // value for 'position'
 *   },
 * });
 */
export function useUpdateRowMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRowMutation, UpdateRowMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateRowMutation, UpdateRowMutationVariables>(UpdateRowDocument, baseOptions);
      }
export type UpdateRowMutationHookResult = ReturnType<typeof useUpdateRowMutation>;
export type UpdateRowMutationResult = ApolloReactCommon.MutationResult<UpdateRowMutation>;
export type UpdateRowMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateRowMutation, UpdateRowMutationVariables>;