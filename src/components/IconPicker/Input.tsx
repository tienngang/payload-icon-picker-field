'use client'
import type { ChangeEvent } from 'react'

import { getTranslation } from '@payloadcms/translations'
import { fieldBaseClass, FieldDescription, FieldError, FieldLabel, RenderCustomComponent, useDebounce, useTranslation } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

import type { IconPickerInputProps } from './types'

const baseClass = 'icon'

export const IconPickerInput: React.FC<IconPickerInputProps> = (props) => {
  const {
    AfterInput,
    BeforeInput,
    className,
    Description,
    description,
    Error,
    inputRef,
    Label,
    label,
    localized,
    onChange,
    onKeyDown,
    path,
    placeholder,
    readOnly,
    required,
    rtl,
    showError,
    style,
    value,
    icons,
  } = props

  const [fieldIsFocused, setFieldIsFocused] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredIcons, setFilteredIcons] = useState(icons)
  const [hoveredIcon, setHoveredIcon] = useState<null | string>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [groupedIcons, setGroupedIcons] = useState<{
    [group: string]: {
      [key: string]: {
        icon: string
        group: string
      }
    }
  }>({})
  const [groupCounts, setGroupCounts] = useState<{ [group: string]: number }>({})
  // Track visible icons count per group
  const [visibleIconsPerGroup, setVisibleIconsPerGroup] = useState<{ [group: string]: number }>({})

  const debouncedSearch = useDebounce(search, 300)

  const { i18n, t } = useTranslation()

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    let value = evt.target.value.replace(/[^a-zA-Z0-9]/g, '')

    /* if (value.length > 0) {
      value = value
        .split('')
        .map((char, index) => {
          if (index === 0 || index === 2) return char.toUpperCase()
          if (index === 1) return char.toLowerCase()
          return char // giữ nguyên các ký tự còn lại
        })
        .join('')
    } */

    evt.target.value = value
    setSearch(evt.target.value)

    onChange?.(evt as any)
  }

  // Group icons by their group property
  useEffect(() => {
    if (!icons) return

    // Group the icons
    const groups: {
      [group: string]: {
        [key: string]: {
          icon: string
          group: string
        }
      }
    } = {}

    Object.entries(icons).forEach(([iconName, iconData]) => {
      const group = iconData.group || 'Other'

      if (!groups[group]) {
        groups[group] = {}
      }

      groups[group][iconName] = iconData
    })

    setGroupedIcons(groups)

    // Set active group to the first one if not already set
    if (!activeGroup && Object.keys(groups).length > 0) {
      setActiveGroup(Object.keys(groups)[0])
    }

    // Initialize visible counts for each group if not already set
    const initialCounts: { [group: string]: number } = { ...visibleIconsPerGroup }
    Object.keys(groups).forEach(group => {
      if (initialCounts[group] === undefined) {
        initialCounts[group] = 250
      }
    })
    setVisibleIconsPerGroup(initialCounts)
  }, [icons]) // Removed activeGroup dependency so we don't reset counts on tab change

  // Filter icons based on search
  useEffect(() => {
    if (!icons) return

    if (debouncedSearch === '') {
      setFilteredIcons(icons)
    } else {
      const foundIcons: any = {}
      Object.keys(icons).forEach(icon => {
        if (icon.toLowerCase().includes(debouncedSearch.toLowerCase())) {
          foundIcons[icon] = icons[icon]
        }
      })
      setFilteredIcons(foundIcons)
    }

    // Reset visible counts per group when search changes
    const initialCounts: { [group: string]: number } = {}
    Object.keys(groupedIcons).forEach(group => {
      initialCounts[group] = 250
    })
    setVisibleIconsPerGroup(initialCounts)
  }, [debouncedSearch, icons, groupedIcons])

  // Calculate group counts separately when filteredIcons changes
  useEffect(() => {
    if (!filteredIcons) return

    // Calculate counts per group
    const counts: { [group: string]: number } = {}
    Object.entries(filteredIcons || {}).forEach(([iconName, iconData]) => {
      const group = iconData.group || 'Other'
      counts[group] = (counts[group] || 0) + 1
    })
    setGroupCounts(counts)
  }, [filteredIcons])

  return (
    <div
      className={[
        fieldBaseClass,
        'icon',
        className,
        showError && 'error',
        readOnly && 'read-only',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={
          <FieldLabel label={label} localized={localized} path={path} required={required} />
        }
      />
      <div className={`${fieldBaseClass}__wrap`}>
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
        {BeforeInput}
        <div
          className={`${baseClass}__input-container`}
          onFocus={() => setFieldIsFocused(true)}
          onBlur={e => {
            // Prevent closing when clicking inside modal elements
            const modalElement = document.querySelector(`.${baseClass}__icon-picker-modal`);
            const tabElement = document.querySelector(`.${baseClass}__icon-picker-modal__tabs`);
            const searchInput = document.querySelector(`.${baseClass}__icon-picker-modal__icon-search`);

            // Check if focus is moving to the modal or tab elements
            if (!e.currentTarget.contains(e.relatedTarget) &&
              (!modalElement || !modalElement.contains(e.relatedTarget)) &&
              (!tabElement || !tabElement.contains(e.relatedTarget)) &&
              (!searchInput || !searchInput.contains(e.relatedTarget))) {
              setTimeout(() => {
                setFieldIsFocused(false);
                setSearch("")
              }, 200)
            }
          }}
        >
          {!rtl && (
            <div className={`${baseClass}__icon-preview`} onClick={() => setFieldIsFocused(true)}>
              <span dangerouslySetInnerHTML={{ __html: (value && icons && icons[value]?.icon) || '' }} />
            </div>
          )}
          <input
            data-rtl={rtl}
            disabled={readOnly}
            id={`field-${path.replace(/\./g, '__')}`}
            name={path}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            placeholder={getTranslation(placeholder as string, i18n)}
            ref={inputRef}
            type="text"
            value={value || ''}
          />
          {rtl && (
            <div className={`${baseClass}__icon-preview`} onClick={() => setFieldIsFocused(true)}>
              <span dangerouslySetInnerHTML={{ __html: (value && icons && icons[value]?.icon) || '' }} />
            </div>
          )}
          {fieldIsFocused && typeof filteredIcons === 'object' && (
            <div
              className={`${baseClass}__icon-picker-modal ${baseClass}__icon-picker-modal--large ${rtl ? `${baseClass}__icon-picker-modal--rtl` : ''
                }`}
              onClick={(e) => {
                // Prevent modal from closing when clicking inside it
                e.stopPropagation();
              }}
              tabIndex={-1}
            >
              <div className={`${baseClass}__icon-picker-modal__pagination-meta-container`}>
                <span>
                  Showing
                  {' '}
                  {activeGroup && Object.keys(filteredIcons as {
                    [key: string]: {
                      icon: string
                      group: string
                    }
                  }).filter(icon => filteredIcons[icon].group === activeGroup).length > (visibleIconsPerGroup[activeGroup] || 250)
                    ? (visibleIconsPerGroup[activeGroup] || 250)
                    : Object.keys(filteredIcons as {
                      [key: string]: {
                        icon: string
                        group: string
                      }
                    }).filter(icon => filteredIcons[icon].group === activeGroup).length}{' '}
                  icons of {Object.keys(icons as {
                    [key: string]: {
                      icon: string
                      group: string
                    }
                  }).filter(icon => icons[icon].group === activeGroup).length}
                </span>
              </div>

              <div className={`${baseClass}__icon-picker-modal__tabs`}>
                {Object.keys(groupedIcons).map(group => (
                  <div
                    key={group}
                    onClick={(e) => {
                      // Prevent event propagation to avoid blur triggering
                      e.stopPropagation();
                      setActiveGroup(group);
                    }}
                    className={`${baseClass}__icon-picker-modal__tab ${activeGroup === group ? `${baseClass}__icon-picker-modal__tab--active` : ''}`}
                  >
                    {group} ({groupCounts[group] || 0})
                  </div>
                ))}
              </div>
              <div className={`${baseClass}__icon-picker-modal__group-container`}
              >
                {activeGroup && (
                  <div
                    className={`${baseClass}__icon-picker-modal__icon-container`}
                    onScroll={(e) => {
                      const container = e.currentTarget;
                      const { scrollTop, scrollHeight, clientHeight } = container;

                      // If we're within 100px of the bottom and not already loading more
                      if (scrollHeight - scrollTop - clientHeight < 100 && !isLoadingMore) {
                        if (visibleIconsPerGroup[activeGroup] < groupCounts[activeGroup]) {
                          setIsLoadingMore(true);
                        }

                        // Add more icons for the current group (increment by 50)
                        setTimeout(() => {
                          if (activeGroup) {
                            setVisibleIconsPerGroup(prev => ({
                              ...prev,
                              [activeGroup]: (prev[activeGroup] || 250) + 100
                            }));
                          }
                          setIsLoadingMore(false);
                        }, 300); // Small delay to prevent rapid firing
                      }
                    }}
                  >
                    {/* If searching, show filtered icons from all groups but only those matching activeGroup */}
                    {debouncedSearch !== '' ? (
                      // Show search results for this group
                      Object.keys(filteredIcons as {
                        [key: string]: {
                          icon: string
                          group: string
                        }
                      })
                        .filter(icon => filteredIcons[icon].group === activeGroup)
                        .slice(0, activeGroup ? visibleIconsPerGroup[activeGroup] || 250 : 250)
                        .map((icon, index) => (
                          <div
                            onClick={() => {
                              onChange?.({
                                target: {
                                  name: path,
                                  value: icon,
                                },
                              } as ChangeEvent<HTMLInputElement>)
                              setFieldIsFocused(false)
                              setFilteredIcons(icons)
                            }}
                            title={icon}
                            onMouseOver={() => setHoveredIcon(icon)}
                            className={`${baseClass}__icon-picker-modal__icon-option ${value == icon ? `${baseClass}__icon-picker-modal__icon-option-active` : ''
                              }`}
                            key={index}
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: (icon && icons && icons[icon].icon) || '',
                              }}
                            />
                          </div>
                        ))
                    ) : (
                      // Show all icons for this group when not searching
                      Object.keys(groupedIcons[activeGroup] || {})
                        .slice(0, activeGroup ? visibleIconsPerGroup[activeGroup] || 250 : 250)
                        .map((icon, index) => (
                          <div
                            onClick={() => {
                              onChange?.({
                                target: {
                                  name: path,
                                  value: icon,
                                },
                              } as ChangeEvent<HTMLInputElement>)
                              setFieldIsFocused(false)
                              setFilteredIcons(icons)
                            }}
                            title={icon}
                            onMouseOver={() => setHoveredIcon(icon)}
                            className={`${baseClass}__icon-picker-modal__icon-option ${value == icon ? `${baseClass}__icon-picker-modal__icon-option-active` : ''
                              }`}
                            key={index}
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: (icon && icons && groupedIcons[activeGroup][icon].icon) || '',
                              }}
                            />
                          </div>
                        ))
                    )}
                    {isLoadingMore && (
                      <div className={`${baseClass}__icon-picker-modal__loading`}>
                        Loading more icons...
                      </div>
                    )}
                  </div>
                )}

                {(!activeGroup || (debouncedSearch !== '' && Object.keys(filteredIcons as {
                  [key: string]: {
                    icon: string
                    group: string
                  }
                }).length === 0)) && (
                    <span>No icons found</span>
                  )}

              </div>
              <div className={`${baseClass}__icon-picker-modal__icon-search`}>
                <input
                  type="search"
                  className="search_field"
                  onChange={e => {
                    setSearch(e.target.value)
                  }}
                  placeholder={hoveredIcon || 'Search icons...'}
                  data-rtl={rtl}
                />
              </div>
            </div>
          )}
        </div>
        {AfterInput}
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </div>
  )
}
