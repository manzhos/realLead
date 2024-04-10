// assets
import { IconCategory2, IconCirclesRelation } from '@tabler/icons';

// constant
const icons = { IconCategory2, IconCirclesRelation };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'roadmap',
  type: 'group',
  children: [
    {
      id: 'projects',
      title: 'Projects',
      type: 'item',
      url: '/projects',
      icon: icons.IconCategory2,
      breadcrumbs: false
    },
    // {
    //   id: 'channels',
    //   title: 'Channels',
    //   type: 'item',
    //   url: '/channels',
    //   icon: icons.IconCirclesRelation,
    //   breadcrumbs: false
    // }
  ]
};

export default other;
