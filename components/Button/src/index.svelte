<script lang="ts">
	import type { KButtonGroupPropsInner, KButtonProps } from './types';
	import { createEventDispatcher, getContext } from 'svelte';
	import { KIcon } from '@ikun-ui/icon';
	import { extend } from 'baiwusanyu-utils';
	import { getPrefixCls, buttonGroupKey, formKey, dropDownKey } from '@ikun-ui/utils';
	import clsx from 'clsx';
	import { type IKunFormInstance } from '@ikun-ui/form';
	import { type KDropdownCtx } from '@ikun-ui/dropdown';

	export let type: KButtonProps['type'] | '' = '';
	export let size: KButtonProps['size'] | '' = '';
	export let icon: KButtonProps['icon'] = '';

	export let suffixIcon: KButtonProps['suffixIcon'] = '';
	export let iconSize: KButtonProps['iconSize'] = null;
	export let to: KButtonProps['to'] = '';
	export let round: KButtonProps['round'] = '';
	export let circle: KButtonProps['circle'] = false;
	export let isBorder: KButtonProps['isBorder'] = false;
	export let plain: KButtonProps['plain'] = false;
	export let ghost: KButtonProps['ghost'] = false;
	export let disabled: KButtonProps['disabled'] = false;
	export let cls: KButtonProps['cls'] = undefined;
	export let attrs: KButtonProps['attrs'] = {};
	export let hiddenSlot: KButtonProps['hiddenSlot'] = false;

	enum EButtonIconSize {
		'lg' = 20,
		'md' = 16,
		'sm' = 12
	}

	const buttonGroupPropsInner = getContext<KButtonGroupPropsInner>(buttonGroupKey) || {};
	$: typeInner = type || buttonGroupPropsInner?.type || 'primary';
	$: sizeInner = buttonGroupPropsInner?.size || size || 'md';
	const isBorderInner = isBorder || buttonGroupPropsInner?.isBorder || ghost || false;
	$: disabledInner = disabled || buttonGroupPropsInner?.disabled || false;
	let iconSizeInner: KButtonProps['iconSize'];
	$: if (iconSize) {
		iconSizeInner = iconSize;
	} else if (buttonGroupPropsInner?.iconSize) {
		iconSizeInner = buttonGroupPropsInner.iconSize;
	} else {
		iconSizeInner = EButtonIconSize[sizeInner];
	}

	const dropDownCtx = getContext(dropDownKey) as KDropdownCtx;
	if (dropDownCtx) {
		dropDownCtx.disabledEvt.push((disabledValue: boolean) => {
			disabledInner = disabledValue;
		});
	}

	let btnRef: null | HTMLElement = null;
	let animationCls = '';
	const handleAnimation = () => {
		if (btnRef as HTMLElement) {
			animationCls = `${prefixCls}--${typeInner}__animate`;
			setTimeout(() => {
				animationCls = '';
			}, 310);
		}
	};

	const dispatch = createEventDispatcher();
	const formInstance = getContext(formKey) as IKunFormInstance;
	const handleClick = (e: Event) => {
		if (disabledInner || formInstance) {
			e.preventDefault();
		}
		if (!to && !disabledInner) {
			dispatch('click', e);
			handleAnimation();
		}
	};

	// class names
	$: prefixCls = getPrefixCls('button');
	$: typePrefixCls = `${prefixCls}--${typeInner}`;
	$: typePrefixClsHover = `${typePrefixCls}__hover`;
	$: cnames = clsx(
		prefixCls,
		`${prefixCls}--base`,
		{
			[`${typePrefixCls}__ghost`]: !plain && ghost,
			[`${typePrefixCls}__ghost--dark`]: !plain && ghost,
			[`${typePrefixCls}__fill`]: !plain && !ghost,
			[`${typePrefixClsHover}__fill`]: !plain && !ghost,
			[typePrefixCls]: plain && !ghost,
			[typePrefixClsHover]: plain && !ghost
		},
		{
			[`${typePrefixCls}__active ${typePrefixCls}__focus`]: !disabledInner,
			[`k-cur-disabled ${prefixCls}--disabled`]: disabledInner,
			[`${prefixCls}--circle`]: circle,
			[`${prefixCls}--circle--sm`]: circle && sizeInner === 'sm',
			[`${prefixCls}--circle--lg`]: circle && sizeInner === 'lg'
		},
		{
			[`${prefixCls}--sm`]: sizeInner === 'sm',
			[`${prefixCls}--lg`]: sizeInner === 'lg'
		},
		{
			[`${prefixCls}--${typeInner}__border`]: isBorderInner
		},
		animationCls,
		cls
	);

	$: attrsInner = extend(attrs, to ? { href: to } : {});

	$: prefixIconCls = `${prefixCls}--${typeInner}__icon`;
	$: cnamesIcon = clsx({
		[prefixIconCls]: true,
		[`${prefixIconCls}__fill`]: !plain && !ghost
	});
</script>

<svelte:element
	this={to ? 'a' : 'button'}
	bind:this={btnRef}
	style="border-radius: {round ? `${round}` : '4'}px; font-size: {iconSizeInner}px"
	class={cnames}

	on:click={handleClick}
	{...attrsInner}
	{...$$restProps}
>
	{#if icon}
		<KIcon {icon} color={cnamesIcon} width={`${iconSizeInner}px`} height={`${iconSizeInner}px`} />
	{/if}
	{#if $$slots.default && icon && !hiddenSlot}
		<div class="ml-1"></div>
	{/if}
	<slot />
	{#if suffixIcon}
		<KIcon
			icon={suffixIcon}
			cls="ml-1"
			color={cnamesIcon}
			width={`${iconSizeInner}px`}
			height={`${iconSizeInner}px`}
		/>
	{/if}
</svelte:element>

<style>
	:global(.k-button--base + .k-button--base) {
		--at-apply: ml-2;
	}
	:global(.k-button-group .k-button--base + .k-button--base) {
		--at-apply: ml-0;
	}
</style>
