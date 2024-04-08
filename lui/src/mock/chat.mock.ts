import { ContentType, IContentMessage, Role, Status } from '../interface';

export const CONVERSATION_MOCK_DATA: IContentMessage = {
  id: 'testdata',
  title: 'mock对话',
  createAt: 1697862242452,
  updateAt: 1697862243540,
  participants: [
    {
      id: 'qwen72b',
      name: 'kate',
      role: Role.assistant,
      avatar:
        'https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*R_7BSIzhH9wAAAAAAAAAAAAADrPSAQ/original',
    },
    {
      id: 'afxuser',
      name: 'user',
      role: Role.user,
      avatar:
        'https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*R_7BSIzhH9wAAAAAAAAAAAAADrPSAQ/original',
    },
  ],
  messages: [
    {
      // ext?: IExtraInfo[]; // 	执行过程/中间态等额外信息
      // status?: Status; // 当前消息返回状态
      id: 'ZGxiX2p4',
      uid: 'afxuser',
      content: '今天的天气如何',
      role: Role.user,
      contentType: ContentType.text,
      createAt: 1697862242452,
      updateAt: 1697862243540,
      timeCost: '0s',
    },
    {
      id: 'Sb5pAzLL',
      // parentId: 'Sb5pAzLL',
      // model: 'gpt-3.5-turbo',
      uid: 'afxuser',
      content: '',
      role: Role.assistant,
      contentType: ContentType.slot,
      componentId: 'yfdTest',
      createAt: 1697862247302,
      updateAt: 1697862249387,
      timeCost: '0s',
      ext: [
        {
          data: {
            title: '今天的天气是',
            temp: '27度',
            tempDes: '晴',
            sub: '我是使用用户通过插槽传入组件渲染的',
          },
        },
      ],
    },
    {
      id: 'Sb5pAzLL1',
      parentId: '111222',
      uid: 'afxuser',
      content: '',
      role: Role.assistant,
      // role: ,
      contentType: ContentType.component,
      componentId: 'component123',
      createAt: 1697862247305,
      updateAt: 1697862249390,
      timeCost: '1s',
      ext: [
        {
          data: {
            title: '今天的天气是',
            temp: '27度',
            tempDes: '晴',
            sub: '我是使用用户通过插槽传入组件渲染的',
          },
        },
      ],
    },
    {
      content: '运行完毕',
      timeCost: '4.9s（LLM 3.4s｜插件 0.9s｜知识库 0.6s）',
      status: 'success' as Status,
      createAt: 1697862247302,
      id: 'Sb5pAaLL',
      parentId: 'Sb5pAzLL',
      role: 'knowledge' as Role,
      uid: 'afxuser',
      updateAt: 1697862249388,
      contentType: 'text' as ContentType,
      ext: [
        {
          source: '已搜索知识库',
          knowledgeName: '测试知识库',
          status: 'success' as Status,
          timeCost: '0.6s',
          children: `recall slice 1:
          test：test`,
        },
        {
          source: '已调用必应搜索',
          pluginName: '必应搜索',
          status: 'success' as Status,
          timeCost: '4.3s：模型3.4s | 工具0.9s',
          children: `{"code":0,"data":{"_type":"SearchResponse","images":{"id":"","isFamilyFriendly":false,"readLink":"","value":null,"webSearchUrl":""},"queryContext":{"originalQuery":"杭州天气"},"rankingResponse":{"mainline":{"items":[{"answerType":"WebPages","value":{"id":"https://api.bing.microsoft.com/api/v7/#WebPages.0"}},{"answerType":"WebPages","resultIndex":1,"value":{"id":"https://api.bing.microsoft.com/api/v7/#WebPages.1"}},{"answerType":"WebPages","resultIndex":2,"value":{"id":"https://api.bing.microsoft.com/api/v7/#WebPages.2"}},{"answerType":"WebPages","resultIndex":3,"value":{"id":"https://api.bing.microsoft.com/api/v7/#WebPages.3"}},{"answerType":"WebPages","resultIndex":4,"value":{"id":"https://api.bing.microsoft.com/api/v7/#WebPages.4"}},`,
        },
      ],
    },
    {
      content: '运行中止',
      status: 'end' as Status,
      createAt: 1697862247302,
      id: 'Sb5pA1LL',
      uid: 'afxuser',
      timeCost: '0s',
      parentId: 'Sb5pAzLL',
      role: 'knowledge' as Role,
      updateAt: 1697862249388,
      contentType: 'text' as ContentType,
      ext: [
        {
          source: '已调用必应搜索',
          pluginName: '必应搜索',
          status: 'success' as Status,
          timeCost: '4.3s：模型3.4s | 工具0.9s',
          children: `recall slice 1:
          test：test`,
        },
      ],
    },
    {
      content: '运行中',
      status: 'loading' as Status,
      createAt: 1697862247302,
      uid: 'afxuser',
      timeCost: '1s',
      id: 'Sb5pA3LL',
      parentId: 'Sb5pA1LL',
      role: 'knowledge' as Role,
      updateAt: 1697862249388,
      contentType: 'text' as ContentType,
      ext: [
        {
          source: '已调用必应搜索',
          pluginName: '必应搜索',
          status: 'loading' as Status,
          timeCost: '4.3s：模型3.4s | 工具0.9s',
          children: `recall slice 1:
          test：test`,
        },
      ],
    },
    {
      content: '运行失败',
      uid: 'afxuser',
      timeCost: '1s',
      status: 'failed' as Status,
      createAt: 1697862247302,
      id: 'Sb5dAzLL',
      parentId: 'Sb5pA3LL',
      role: 'tool' as Role,
      updateAt: 1697862249389,
      contentType: 'text' as ContentType,
      ext: [
        {
          source: '已调用必应搜索',
          pluginName: '必应搜索',
          status: 'failed' as Status,
          timeCost: '4.3s：模型3.4s | 工具0.9s',
          children: `recall slice 1:
          test：test`,
        },
      ],
    },
  ],
};
