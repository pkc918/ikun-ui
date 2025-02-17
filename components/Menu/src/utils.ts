import type { KMenuInstance, KMenuInstanceOption, SubMenuType } from './types';
import { isArray, isString } from 'baiwusanyu-utils';
export const createKMenu = (
	options: KMenuInstanceOption,
	onOpenChange: KMenuInstance['onOpenChange'],
	onSelect: KMenuInstance['onSelect'],
	onClick: KMenuInstance['onClick'],
	onDeSelect: KMenuInstance['onDeSelect'],
	removeBorderStyleBg: KMenuInstance['removeBorderStyleBg'],
	getParentDom: KMenuInstance['getParentDom']
): KMenuInstance => {
	return {
		/**
		 * @internal
		 */
		__propHandleEvtMap: [],
		__dynamicProps: {
			...options
		},
		__openUids: new Set(options.openUids),
		__selectedUids: new Set(options.selectedUids),
		__selectedItems: new Map(),
		syncUids(uid: string | string[], type: 'open' | 'selected', opType: 'add' | 'delete' = 'add') {
			let uids = uid;
			if (isString(uid)) {
				uids = [uid as string];
			}
			if (isArray(uids)) {
				(uids as string[]).forEach((id) => {
					type === 'open' ? this.__openUids![opType](id) : this.__selectedUids![opType](id);
				});
			}
		},
		syncSelectedItems(item: SubMenuType, opType: 'set' | 'delete' = 'set') {
			const { uid } = item;
			if (opType === 'set') {
				this.__selectedItems?.set(uid!, item);
			}

			if (opType === 'delete') {
				this.__selectedItems?.delete(uid!);
			}
		},
		onOpenChange,
		onSelect,
		onClick,
		onDeSelect,
		removeBorderStyleBg,
		getParentDom
	};
};

export function transitionIn(node: HTMLElement) {
	return {
		duration: 300,
		tick: (t: number) => {
			if (t === 0) {
				node.style.height = '0';
			} else if (t === 1) {
				node.style.removeProperty('height');
			} else {
				node.style.height = node.scrollHeight + 'px';
			}
		}
	};
}

export function transitionOut(node: HTMLElement) {
	const orgHeight = node.scrollHeight;
	return {
		duration: 300,
		tick: (t: number) => {
			if (t <= 1 && t >= 0.9) {
				node.style.height = orgHeight + 'px';
			} else if (t === 0) {
				node.style.removeProperty('height');
			} else {
				node.style.height = '0';
			}
		}
	};
}

export function getUidPath(uid: string, list: SubMenuType[], path: string[] = []) {
	// 遍历树结构数组中的每个节点
	// Traverse each node in the tree structure array
	for (const node of list) {
		// 如果当前节点的 uid 与给定的 uid 匹配，返回当前路径
		// If the current node's uid matches the given uid, return the current path
		if (node.uid === uid) {
			return path.concat(uid);
		}

		// 如果当前节点包含子节点，则递归搜索子节点
		// If the current node has child nodes, recursively search for the child nodes
		if (node.children && node.children.length > 0) {
			// 在路径中添加当前节点的 uid
			// Add the current node's uid to the path
			const newPath = path.concat(node.uid!);
			// 递归搜索子节点
			// Recursive search for child nodes
			const result = getUidPath(uid, node.children!, newPath) as null | string[];
			// 如果找到了目标节点，则返回结果
			// If the target node is found, the result is returned
			if (result) {
				return result;
			}
		}
	}

	// 如果在当前节点及其子节点中未找到目标节点，则返回空
	// If the target node is not found in the current node and its child nodes,
	// it returns null.
	return null;
}
