import React, { useMemo } from 'react';
import { Box, Flex, useTheme, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import MyIcon from '@/components/Icon';
import Avatar from '@/components/Avatar';
import type { FlowModuleItemType } from '@fastgpt/global/core/module/type.d';
import MyTooltip from '@/components/MyTooltip';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { useTranslation } from 'next-i18next';
import { useEditTitle } from '@/web/common/hooks/useEditTitle';
import { useToast } from '@/web/common/hooks/useToast';
import { useFlowProviderStore, onChangeNode } from '../../FlowProvider';
import {
  FlowNodeSpecialInputKeyEnum,
  FlowNodeTypeEnum
} from '@fastgpt/global/core/module/node/constant';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import { getPluginModuleDetail } from '@/web/core/plugin/api';
import { getErrText } from '@fastgpt/global/common/error/utils';
import { useConfirm } from '@/web/common/hooks/useConfirm';

type Props = FlowModuleItemType & {
  children?: React.ReactNode | React.ReactNode[] | string;
  minW?: string | number;
  isPreview?: boolean;
};

const NodeCard = (props: Props) => {
  const {
    children,
    logo = '/icon/logo.svg',
    name = '未知模块',
    description,
    minW = '300px',
    moduleId,
    flowType,
    inputs,
    isPreview
  } = props;
  const { onCopyNode, onResetNode, onDelNode } = useFlowProviderStore();
  const { t } = useTranslation();
  const theme = useTheme();
  const { toast } = useToast();
  const { setLoading } = useSystemStore();

  // custom title edit
  const { onOpenModal, EditModal: EditTitleModal } = useEditTitle({
    title: t('common.Custom Title'),
    placeholder: t('app.module.Custom Title Tip') || ''
  });
  const { openConfirm, ConfirmModal } = useConfirm({
    content: t('module.Confirm Sync Plugin')
  });

  const menuList = useMemo(
    () => [
      ...(flowType === FlowNodeTypeEnum.pluginModule
        ? [
            {
              icon: 'common/refreshLight',
              label: t('plugin.Synchronous version'),
              onClick: () => {
                const pluginId = inputs.find(
                  (item) => item.key === FlowNodeSpecialInputKeyEnum.pluginId
                )?.value;
                if (!pluginId) return;
                openConfirm(async () => {
                  try {
                    setLoading(true);
                    const pluginModule = await getPluginModuleDetail(pluginId);
                    onResetNode(moduleId, pluginModule);
                  } catch (e) {
                    return toast({
                      status: 'error',
                      title: getErrText(e, t('plugin.Get Plugin Module Detail Failed'))
                    });
                  }
                  setLoading(false);
                })();
              }
            }
          ]
        : [
            {
              icon: 'edit',
              label: t('common.Rename'),
              onClick: () =>
                onOpenModal({
                  defaultVal: name,
                  onSuccess: (e) => {
                    if (!e) {
                      return toast({
                        title: t('app.modules.Title is required'),
                        status: 'warning'
                      });
                    }
                    onChangeNode({
                      moduleId,
                      type: 'attr',
                      key: 'name',
                      value: e
                    });
                  }
                })
            }
          ]),
      {
        icon: 'copy',
        label: t('common.Copy'),
        onClick: () => onCopyNode(moduleId)
      },
      {
        icon: 'delete',
        label: t('common.Delete'),
        onClick: () => onDelNode(moduleId)
      },

      {
        icon: 'back',
        label: t('common.Back'),
        onClick: () => {}
      }
    ],
    [
      flowType,
      inputs,
      moduleId,
      name,
      onCopyNode,
      onDelNode,
      onOpenModal,
      onResetNode,
      openConfirm,
      setLoading,
      t,
      toast
    ]
  );

  return (
    <Box
      minW={minW}
      maxW={'500px'}
      bg={'white'}
      border={theme.borders.md}
      borderRadius={'md'}
      boxShadow={'sm'}
      className={isPreview ? 'nodrag' : ''}
    >
      <Flex className="custom-drag-handle" px={4} py={3} alignItems={'center'}>
        <Avatar src={logo} borderRadius={'md'} objectFit={'contain'} w={'30px'} h={'30px'} />
        <Box ml={3} fontSize={'lg'} color={'myGray.600'}>
          {name}
        </Box>
        {description && (
          <MyTooltip label={description} forceShow>
            <QuestionOutlineIcon
              display={['none', 'inline']}
              transform={'translateY(1px)'}
              mb={'1px'}
              ml={1}
            />
          </MyTooltip>
        )}
        <Box flex={1} />
        {!isPreview && (
          <Menu autoSelect={false} isLazy>
            <MenuButton
              className={'nodrag'}
              _hover={{ bg: 'myWhite.600' }}
              cursor={'pointer'}
              borderRadius={'md'}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MyIcon name={'more'} w={'14px'} p={2} />
            </MenuButton>
            <MenuList color={'myGray.700'} minW={`120px !important`} zIndex={10}>
              {menuList.map((item) => (
                <MenuItem key={item.label} onClick={item.onClick} py={[2, 3]}>
                  <MyIcon name={item.icon as any} w={['14px', '16px']} />
                  <Box ml={[1, 2]}>{item.label}</Box>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      </Flex>
      {children}
      <EditTitleModal />
      <ConfirmModal />
    </Box>
  );
};

export default React.memo(NodeCard);
