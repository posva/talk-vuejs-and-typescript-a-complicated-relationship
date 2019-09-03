import { useQuery, mutate } from 'vue-apollo'
import { nextTick, reactive, ref, watch, computed } from '@vue/composition-api'

// Reusable functions not specific to this component
import { useNetworkState } from '@/functions/network'
import { usePathUtils } from '@/functions/path'
import { resetCwdOnLeave, useCwdUtils } from '@/functions/cwd'

// GraphQL
import FOLDER_CURRENT from '@/graphql/folder/folderCurrent.gql'
import FOLDERS_FAVORITE from '@/graphql/folder/favoriteFolders.gql'
import FOLDER_OPEN from '@/graphql/folder/folderOpen.gql'
import FOLDER_OPEN_PARENT from '@/graphql/folder/folderOpenParent.gql'
import FOLDER_SET_FAVORITE from '@/graphql/folder/folderSetFavorite.gql'
import FOLDER_CREATE from '@/graphql/folder/folderCreate.gql'

// Misc
import { isValidMultiName } from '@/util/folders'
const SHOW_HIDDEN = 'vue-ui.show-hidden-folders'

export default {
  setup() {
    // Network
    const { networkState } = useNetworkState()

    // Folder
    const { folders, currentFolderData } = useCurrentFolderData(networkState)
    const folderNavigation = useFolderNavigation({
      networkState,
      currentFolderData,
    })
    const { favoriteFolders, toggleFavorite } = useFavoriteFolders(
      currentFolderData
    )
    const { showHiddenFolders } = useHiddenFolders()
    const createFolder = useCreateFolder(folderNavigation.openFolder)

    // Current working directory
    resetCwdOnLeave()
    const { updateOnCwdChanged } = useCwdUtils()

    // Utils
    const { slicePath } = usePathUtils()

    return {
      networkState,
      folders,
      currentFolderData,
      folderNavigation,
      favoriteFolders,
      toggleFavorite,
      showHiddenFolders,
      createFolder,
      updateOnCwdChanged,
      slicePath,
    }
  },
}

// Reusable functions specific to this component
function useCurrentFolderData(networkState) {
  const folders = ref<HTMLElement>(null)

  const currentFolderData = useQuery(
    {
      query: FOLDER_CURRENT,
      fetchPolicy: 'networkState-only',
      networkState,
      async result() {
        await nextTick()
        folders.value.scrollTop = 0
      },
    },
    {}
  )
  return {
    folders,
    currentFolderData,
  }
}

function useFolderNavigation({ networkState, currentFolderData }) {
  // Path editing
  const pathEditing = reactive({
    editingPath: false,
    editedPath: '',
  })

  // DOM ref
  const pathInput = ref<HTMLElement>(null)

  async function openPathEdit() {
    pathEditing.editedPath = currentFolderData.path
    pathEditing.editingPath = true
    await nextTick()
    pathInput.value.focus()
  }

  function submitPathEdit() {
    openFolder(pathEditing.editedPath)
  }

  // Folder opening
  const openFolder = async path => {
    pathEditing.editingPath = false
    networkState.error = null
    networkState.loading++
    try {
      await mutate({
        mutation: FOLDER_OPEN,
        variables: {
          path,
        },
        update: (store, { data: { folderOpen } }) => {
          store.writeQuery({
            query: FOLDER_CURRENT,
            data: { currentFolderData: folderOpen },
          })
        },
      })
    } catch (e) {
      networkState.error = e
    }
    networkState.loading--
  }

  async function openParentFolder() {
    pathEditing.editingPath = false
    networkState.error = null
    networkState.loading++
    try {
      await mutate({
        mutation: FOLDER_OPEN_PARENT,
        update: (store, { data: { folderOpenParent } }) => {
          store.writeQuery({
            query: FOLDER_CURRENT,
            data: { currentFolderData: folderOpenParent },
          })
        },
      })
    } catch (e) {
      networkState.error = e
    }
    networkState.loading--
  }

  // Refresh
  function refreshFolder() {
    openFolder(currentFolderData.path)
  }

  return {
    pathInput,
    pathEditing,
    openPathEdit,
    submitPathEdit,
    openFolder,
    openParentFolder,
    refreshFolder,
  }
}

function useFavoriteFolders(currentFolderData) {
  const favoriteFolders = useQuery(FOLDERS_FAVORITE, [])

  async function toggleFavorite() {
    await mutate({
      mutation: FOLDER_SET_FAVORITE,
      variables: {
        path: currentFolderData.path,
        favorite: !currentFolderData.favorite,
      },
      update: (store, { data: { folderSetFavorite } }) => {
        store.writeQuery({
          query: FOLDER_CURRENT,
          data: { currentFolderData: folderSetFavorite },
        })
        let data = store.readQuery({ query: FOLDERS_FAVORITE })
        // TODO this is a workaround
        // See: https://github.com/apollographql/apollo-client/issues/4031#issuecomment-433668473
        data = {
          favoriteFolders: data.favoriteFolders.slice(),
        }
        if (folderSetFavorite.favorite) {
          data.favoriteFolders.push(folderSetFavorite)
        } else {
          const index = data.favoriteFolders.findIndex(
            f => f.path === folderSetFavorite.path
          )
          index !== -1 && data.favoriteFolders.splice(index, 1)
        }
        store.writeQuery({ query: FOLDERS_FAVORITE, data })
      },
    })
  }

  return {
    favoriteFolders,
    toggleFavorite,
  }
}

function useHiddenFolders() {
  const showHiddenFolders = ref(localStorage.getItem(SHOW_HIDDEN) === 'true')
  watch(
    showHiddenFolders,
    value => {
      if (value) {
        localStorage.setItem(SHOW_HIDDEN, 'true')
      } else {
        localStorage.removeItem(SHOW_HIDDEN)
      }
    },
    { lazy: true }
  )

  return {
    showHiddenFolders,
  }
}

function useCreateFolder(openFolder) {
  const showNewFolder = ref(false)
  const newFolderName = ref('')
  const newFolderValid = computed(() => isValidMultiName(newFolderName.value))

  async function createFolder() {
    if (!newFolderValid.value) return
    const result = await mutate({
      mutation: FOLDER_CREATE,
      variables: {
        name: newFolderName.value,
      },
    })
    openFolder(result.data.folderCreate.path)
    newFolderName.value = ''
    showNewFolder.value = false
  }

  return {
    showNewFolder,
    newFolderName,
    newFolderValid,
    createFolder,
  }
}
