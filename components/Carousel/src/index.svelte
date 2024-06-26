<script lang="ts">
	import { getPrefixCls } from '@ikun-ui/utils';
	import { clsx } from 'clsx';
	import type { KCarouselProps } from './types';
	import { KIndicators } from '@ikun-ui/indicators';
	import KCarouselArrow from './arrow.svelte';
	import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte';
	export let cls: KCarouselProps['cls'] = undefined;
	export let attrs: KCarouselProps['attrs'] = {};
	export let trigger: KCarouselProps['trigger'] = 'click';
	export let arrow: KCarouselProps['arrow'] = 'hover';
	export let count: KCarouselProps['count'] = 0;
	export let loop: KCarouselProps['loop'] = true;
	export let autoplay: KCarouselProps['autoplay'] = true;
	export let pauseOnHover: KCarouselProps['pauseOnHover'] = true;
	export let interval: KCarouselProps['interval'] = 3000;
	export let height: KCarouselProps['count'] = 0;
	export let initialIndex: KCarouselProps['initialIndex'] = 0;
	$: wrapWidth = `${count * 100}%`;

	let pageIndex = initialIndex;
	let resolveHeight = height ? `${height}px` : '';
	let transition = 'left .5s ease 0s';
	const dispatch = createEventDispatcher();
	let oldIndex = pageIndex;
	let carouselRef: any = null;
	const handlePageChange = async (e: CustomEvent) => {
		const { index, type: actionType } = e.detail;
		const children = carouselRef.querySelector('.k-carousel-item-wrap')?.children;
		oldIndex = pageIndex;
		if (!loop) {
			pageIndex = index;
			wrapLeft = `-${pageIndex * 100}%`;
			if (children) {
				!height && (resolveHeight = `${children[pageIndex].clientHeight}px`);
			}
			dispatch('change', { index: pageIndex, oldIndex });
			return;
		} else {
			if (children) {
				transition = 'left .5s ease 0s';
				children[index] && !height && (resolveHeight = `${children[index].clientHeight}px`);

				if (actionType === 'etf' && loop) {
					pageIndex = count;
					wrapLeft = `-${pageIndex * 100}%`;
					const firstElm = children[0];
					if (firstElm) {
						(firstElm as HTMLElement).style.transform = `translateX(${wrapWidth})`;
						resetChild(firstElm as HTMLElement, index);
					}
				} else if (actionType === 'fte' && loop) {
					pageIndex = count;
					wrapLeft = `100%`;
					await tick();
					const lastElm = children[count - 1];
					if (lastElm) {
						(lastElm as HTMLElement).style.transform = `translateX(-${count * 100}%)`;
						resetChild(lastElm as HTMLElement, index);
					}
				} else {
					pageIndex = index;
					wrapLeft = `-${pageIndex * 100}%`;
					dispatch('change', { index: pageIndex, oldIndex });
				}
			}
		}
	};

	function resetChild(el: HTMLElement, index: number) {
		pageIndex = index;
		setTimeout(() => {
			// reset
			el.style.transform = '';
			transition = '';
			wrapLeft = `-${pageIndex * 100}%`;
			dispatch('change', { index, oldIndex });
		}, 500);
	}

	const showArrow = (show: boolean) => {
		if (arrow === 'always') return true;
		if (arrow === 'never') return false;
		if (arrow === 'hover') return show;
	};
	let isShowArrow = showArrow(false);
	const handleMouseenter = () => {
		pauseOnHover && timer && clearInterval(timer);
		isShowArrow = showArrow(true);
	};

	const handleMouseleave = () => {
		pauseOnHover && doAutoplay();
		isShowArrow = showArrow(false);
	};

	let arrowRef: any = null;
	let timer: null | number = null;
	const doAutoplay = () => {
		if (autoplay) {
			timer = window.setInterval(() => {
				arrowRef && arrowRef.gotoNext();
			}, interval);
		}
	};

	onMount(() => {
		const children = carouselRef.querySelector('.k-carousel-item-wrap')?.children;
		if (children && children[pageIndex]) {
			resolveHeight = height ? `${height}px` : `${children[pageIndex].clientHeight}px`;
		}
		doAutoplay();
	});

	onDestroy(() => {
		timer && clearInterval(timer);
	});

	/**
	 * api goto
	 * manual switch
	 * @public
	 */
	export function goto(page: number) {
		arrowRef && arrowRef.setPage(page);
	}

	/**
	 * api prev
	 * Switch to previous picture
	 * @public
	 */
	export function prev() {
		arrowRef && arrowRef.gotoPrev();
	}

	/**
	 * api next
	 * Switch to next picture
	 * @public
	 */
	export function next() {
		arrowRef && arrowRef.gotoNext();
	}

	let wrapLeft = `-${initialIndex * 100}%`;
	$: {
		wrapLeft = `-${initialIndex * 100}%`;
	}
	const prefixCls = getPrefixCls('carousel');
	$: cnames = clsx(prefixCls, cls);
	$: wrapCls = clsx(`${prefixCls}-wrap`);
	$: wrapItemCls = clsx(`${prefixCls}-item-wrap`);
</script>

<div
	aria-hidden="true"
	on:mouseenter={handleMouseenter}
	on:mouseleave={handleMouseleave}
	class={cnames}
	bind:this={carouselRef}
	{...$$restProps}
	{...attrs}
>
	<div class={wrapCls} style:height={resolveHeight}>
		<div
			class={wrapItemCls}
			style:width={wrapWidth}
			style:left={wrapLeft}
			style:transition
			data-active={pageIndex}
			data-carousel-container
		>
			<slot />
		</div>
	</div>
	<slot
		name="arrow"
		onChange={handlePageChange}
		defaultPageIndex={pageIndex}
		show={isShowArrow}
		{count}
		{loop}
	>
		<KCarouselArrow
			bind:this={arrowRef}
			show={isShowArrow}
			{loop}
			defaultPageIndex={pageIndex}
			on:change={handlePageChange}
			{count}
		/>
	</slot>
	<slot
		name="indicators"
		onChange={handlePageChange}
		defaultPageIndex={pageIndex}
		{count}
		{trigger}
	>
		<KIndicators {count} {trigger} on:change={handlePageChange} defaultPageIndex={pageIndex} />
	</slot>
</div>
